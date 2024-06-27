import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import { UpdateAvatarDto } from './dto/UpdateAvatar.dto';
import { DeleteUserDto } from './dto/DeleteUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async editUser(user: Users, updateUserDto: UpdateUserDto) {
    try {
      if (!user) throw new NotFoundException('User not found');

      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: updateUserDto,
      });
      delete updatedUser.password;
      delete updatedUser.refresh_token;

      return updatedUser;
    } catch (error) {
      throw new HttpException(
        'Something went wrong, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(user: Users, updatePasswordDto: UpdatePasswordDto) {
    try {
      if (!user) throw new NotFoundException('User not found');

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
      throw new HttpException(
        'Something went wrong, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAvatar(user: Users, updateAvatarDto: UpdateAvatarDto) {
    try {
      if (!user) throw new NotFoundException('User not found');

      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // Extract public_id from URL
        await this.cloudinaryService.removeFile(publicId);
      }

      const newAvatar = await this.cloudinaryService.uploadFile(
        updateAvatarDto.avatar,
        user.userName,
      );
      const avatarUrl: string = newAvatar.url;

      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          avatar: avatarUrl,
        },
      });
      delete updatedUser.password;
      delete updatedUser.refresh_token;

      return updatedUser;
    } catch (error) {
      throw new HttpException(
        'Something went wrong, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(user: Users, deleteUserDto: DeleteUserDto) {
    try {
      if (!user) throw new NotFoundException('User not found');

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
      throw new HttpException(
        'Something went wrong, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
