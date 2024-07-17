import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new UnauthorizedException();
    if (!user.refresh_token) {
      throw new UnauthorizedException(
        'No refresh token available. Please log in again.',
      );
    }
    return user;
  }
}
