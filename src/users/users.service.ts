import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import { UpdateAvatarDto } from './dto/UpdateAvatar.dto';
import { DeleteUserDto } from './dto/DeleteUser.dto';
import { stripUserOfSensitiveData } from '../utils/helpers';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async editUser(user: Users, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: updateUserDto,
      });

      return stripUserOfSensitiveData(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an issue updating the user',
      );
    }
  }

  async updatePassword(user: Users, updatePasswordDto: UpdatePasswordDto) {
    try {
      if (
        updatePasswordDto.newPassword !== updatePasswordDto.confirmNewPassword
      )
        throw new ForbiddenException('Passwords do not match');

      const isPasswordValid = await bcrypt.compare(
        updatePasswordDto.password,
        user.password,
      );

      if (!isPasswordValid) throw new ForbiddenException('Invalid password');

      const newPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          password: newPassword,
        },
      });

      return { success: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an issue updating the user password',
      );
    }
  }

  async updateAvatar(user: Users, updateAvatarDto: UpdateAvatarDto) {
    try {
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // Extract public_id from URL
        await this.cloudinaryService.removeFile(publicId);
      }

      const newAvatar = await this.cloudinaryService.uploadFile(
        updateAvatarDto.avatar,
        user.email,
      );
      const avatarUrl: string = newAvatar.secure_url;

      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          avatar: avatarUrl,
        },
      });

      return stripUserOfSensitiveData(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an issue updating the user avatar',
      );
    }
  }

  async deleteUser(user: Users, deleteUserDto: DeleteUserDto) {
    try {
      if (deleteUserDto.password !== deleteUserDto.confirmPassword)
        throw new ForbiddenException('Passwords do not match');

      const isPasswordValid = await bcrypt.compare(
        user.password,
        deleteUserDto.password,
      );

      if (!isPasswordValid) throw new ForbiddenException('Invalid password');

      await this.prisma.users.delete({
        where: {
          id: user.id,
        },
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an issue deleting the user',
      );
    }
  }
}
