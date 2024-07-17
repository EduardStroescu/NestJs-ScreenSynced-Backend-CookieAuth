import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
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
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import { UpdateAvatarDto } from './dto/UpdateAvatar.dto';
import { DeleteUserDto } from './dto/DeleteUser.dto';

@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Current user retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Get('current-user')
  getCurrentUser(@GetUser() user: Users) {
    delete user.refresh_token;
    delete user.password;
    return user;
  }

  @ApiOkResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @Patch('update-details')
  async editUser(@GetUser() user: Users, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.editUser(user, updateUserDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User password updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiResponse({
    description: 'Internal Server Error',
    status: 500,
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
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiResponse({
    description: 'Internal Server Error',
    status: 500,
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
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiForbiddenResponse({
    description: 'Invalid password or passwords do not match',
    status: 403,
  })
  @ApiResponse({
    description: 'Internal Server Error',
    status: 500,
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
