import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Old Password',
    minLength: 8,
    maxLength: 20,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @ApiProperty({
    type: String,
    description: 'New Password',
    minLength: 8,
    maxLength: 20,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Confirm NewPassword',
    minLength: 8,
    maxLength: 20,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  confirmNewPassword: string;
}
