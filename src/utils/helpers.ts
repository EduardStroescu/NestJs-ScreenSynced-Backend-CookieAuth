import { Users } from '@prisma/client';

export const cookieConfig = (
  nodeEnv: string,
): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | 'none' | 'lax' | 'strict';
  path: string;
} => {
  return {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax',
    path: '/',
  };
};

export const stripUserOfSensitiveData = (user: Users) => {
  delete user.password;
  delete user.refresh_token;
  delete user.googleId;
  delete user.facebookId;

  return user;
};
