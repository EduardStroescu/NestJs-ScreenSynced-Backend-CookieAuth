import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { GetUser } from '../auth/decorator/GetUser.decorator';
import { Users } from '@prisma/client';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import { UpdateAvatarDto } from './dto/UpdateAvatar.dto';
import { DeleteUserDto } from './dto/DeleteUser.dto';
import { PrivateUserDto } from '../lib/dtos/user.dto';
import { stripUserOfSensitiveData } from '../utils/helpers';

@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    type: PrivateUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Get('current-user')
  getCurrentUser(@GetUser() user: Users) {
    return stripUserOfSensitiveData(user);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User details updated successfully',
    type: PrivateUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an issue updating the user',
  })
  @Patch('update-details')
  async editUser(@GetUser() user: Users, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.editUser(user, updateUserDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User password updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'string',
          example: 'Password updated successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an issue updating the user password',
  })
  @Put('update-password')
  async updatePassword(
    @GetUser() user: Users,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user, updatePasswordDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Avatar updated successfully',
    type: PrivateUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an issue updating the user avatar',
  })
  @Patch('change-avatar')
  async updateAvatar(
    @GetUser() user: Users,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    return this.usersService.updateAvatar(user, updateAvatarDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiForbiddenResponse({
    description: 'Invalid password or passwords do not match',
    status: 403,
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an issue deleting the user',
  })
  @UseGuards(JwtGuard)
  @Delete('delete')
  async deleteUser(
    @GetUser() user: Users,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    return this.usersService.deleteUser(user, deleteUserDto);
  }
}
