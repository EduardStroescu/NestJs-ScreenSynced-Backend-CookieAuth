import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Old Password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'New Password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Confirm New Password',
  })
  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}
