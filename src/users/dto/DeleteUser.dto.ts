import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    type: String,
    description: 'Password',
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
    description: 'Confirm Password',
    minLength: 8,
    maxLength: 20,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  confirmPassword: string;
}
