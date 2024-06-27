import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    type: String,
    description: 'Password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Confirm Password',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
