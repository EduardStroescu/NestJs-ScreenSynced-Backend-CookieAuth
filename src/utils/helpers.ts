import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';

const getClientDomain = (clientUrl: string) => {
  return clientUrl.replace('https://', '').replace('http://', '');
};

export const getCookieConfig = (
  configService: ConfigService,
): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'none' | 'lax' | 'strict';
  domain: string | undefined;
  path: string;
  maxAgeAccessToken: number;
  maxAgeRefreshToken: number;
} => {
  return {
    httpOnly: true,
    secure: configService.get('NODE_ENV') === 'production',
    sameSite: 'lax',
    domain:
      configService.get('NODE_ENV') === 'production'
        ? getClientDomain(configService.get('CLIENT_URL'))
        : undefined,
    path: '/',
    maxAgeAccessToken: 15 * 60 * 1000, // 15 minutes
    maxAgeRefreshToken: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export const stripUserOfSensitiveData = (user: Users) => {
  delete user.password;
  delete user.refresh_token;
  delete user.googleId;
  delete user.facebookId;

  return user;
};
