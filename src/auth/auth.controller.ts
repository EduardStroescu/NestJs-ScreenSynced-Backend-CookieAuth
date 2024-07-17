import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
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
  })
  @ApiConflictResponse({ description: 'User already Exists', status: 401 })
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

  @Post('login')
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    status: 401,
  })
  @HttpCode(HttpStatus.OK)
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
    const { access_token, refresh_token } = await this.authService.oauthLogin(
      req.user,
      'google',
    );
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(this.configService.get('CLIENT_URL') + '?redirect=true');
  }

  @UseGuards(FacebookAuthGuard)
  @Get('/login/facebook')
  async facebookLogin() {}

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/redirect')
  async facebookRedirect(@Req() req: Request, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.oauthLogin(
      req.user,
      'facebook',
    );
    const cookieOptions = cookieConfig(this.configService.get('NODE_ENV'));

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(this.configService.get('CLIENT_URL') + '?redirect=true');
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

  @UseGuards(JwtGuard)
  @ApiCookieAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
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
