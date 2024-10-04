import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FacebookAuthGuard, GoogleAuthGuard, JwtGuard } from './guards';
import { GetUser } from './decorator/GetUser.decorator';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { cookieConfig } from '../utils/helpers';
import { PrivateUserDto } from '../lib/dtos/user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    status: 201,
    description: 'User Created',
    type: PrivateUserDto,
  })
  @ApiConflictResponse({ description: 'User already Exists', status: 401 })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while registering new user',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { access_token, refresh_token, ...user } =
      await this.authService.register(createUserDto);
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    return user;
  }

  @ApiOkResponse({
    status: 200,
    description: 'Logged in successfully',
    type: PrivateUserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while logging the user in',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { access_token, refresh_token, ...user } =
      await this.authService.login(loginUserDto);
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    return user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/login/google')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user)
      return res.redirect(
        this.configService.get('CLIENT_URL') + '?error=user_not_found',
      );
    const { access_token, refresh_token } = await this.authService.oauthLogin(
      req.user,
      'google',
    );
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(this.configService.get('CLIENT_URL') + '?success=true');
  }

  @UseGuards(FacebookAuthGuard)
  @Get('/login/facebook')
  async facebookLogin() {}

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/redirect')
  async facebookRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user)
      return res.redirect(
        this.configService.get('CLIENT_URL') + '?error=user_not_found',
      );
    const { access_token, refresh_token } = await this.authService.oauthLogin(
      req.user,
      'facebook',
    );
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(this.configService.get('CLIENT_URL') + '?success=true');
  }

  @Get('error')
  authError(@Query('message') message: string, @Res() res: Response) {
    res.redirect(this.configService.get('CLIENT_URL') + '?error=' + message);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token, log in again',
    status: 401,
  })
  @HttpCode(HttpStatus.OK)
  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }

  @ApiCookieAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'string',
          example: 'Logged out successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', '', cookieOptions);
    res.cookie('refresh_token', '', cookieOptions);
    return await this.authService.logout(userId);
  }
}
