import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const activateResult = (await super.canActivate(context)) as boolean;

      // Handle cases where the user declined the authentication
      if (request.query.error) {
        response.redirect(`/api/auth/error?message=${request.query.error}`);
        return false;
      }

      // User is authenticated, let the request proceed
      return activateResult;
    } catch (err) {
      // Handle other types of errors
      response.redirect(
        `/api/auth/error?message=${err.message || 'Authentication failed'}`,
      );
      return false;
    }
  }
}
