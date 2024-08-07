import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [JwtModule.register({}), CloudinaryModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
