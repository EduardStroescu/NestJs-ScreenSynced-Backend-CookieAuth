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
