import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
