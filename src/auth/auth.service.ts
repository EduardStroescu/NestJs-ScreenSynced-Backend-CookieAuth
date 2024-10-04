import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Request, Response } from 'express';
import { stripUserOfSensitiveData } from '../utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async register(user: CreateUserDto) {
    try {
      const password = await bcrypt.hash(user.password, 10);
      let avatar: string;
      if (user.avatar) {
        const userAvatar = await this.cloudinaryService.uploadFile(
          user.avatar,
          user.email,
        );
        avatar = userAvatar.secure_url;
      }
      let newUser = await this.prisma.users.create({
        data: {
          email: user.email,
          password,
          displayName: user.displayName,
          avatar,
        },
      });
      const tokens = await this.signTokens(newUser.id, newUser.email);
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);

      newUser = stripUserOfSensitiveData(newUser);
      return {
        ...newUser,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint failed
        throw new ConflictException('User already exists');
      }
      throw new HttpException(
        'An error occurred while registering user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      let user = await this.prisma.users.findUnique({
        where: {
          email: loginUserDto.email,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid email or password');

      const tokens = await this.signTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      user = stripUserOfSensitiveData(user);
      return {
        ...user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while logging the user in',
      );
    }
  }

  async oauthLogin(profile: any, provider: 'google' | 'facebook') {
    let user = await this.prisma.users.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: profile.email,
          displayName: `${profile.firstName}${profile.lastName}`,
          avatar: profile.picture || null,
          [`${provider}Id`]: profile.id,
        },
      });
    } else if (user) {
      if (!user[`${provider}Id`]) {
        user = await this.prisma.users.update({
          where: { email: profile.email },
          data: {
            [`${provider}Id`]: profile.id,
          },
        });
      }
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const user = await this.prisma.users.findFirst({
        where: {
          refresh_token: refreshToken,
        },
      });

      if (!user || user.refresh_token !== refreshToken)
        throw new UnauthorizedException(
          'Invalid refresh token, please log in again',
        );

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });

      const { access_token } = await this.signTokens(
        payload.sub,
        payload.email,
      );

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite:
          this.configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
        path: '/',
      });
      return { success: 'Token refreshed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException(
        'Invalid refresh token, please log in again',
      );
    }
  }

  async logout(userId: number) {
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        refresh_token: '',
      },
    });

    return { success: 'Logged out successfully' };
  }

  private async signTokens(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const accessSecret = this.configService.get('ACCESS_SECRET');
    const refreshSecret = this.configService.get('REFRESH_SECRET');

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: accessSecret,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: refreshSecret,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }
}
