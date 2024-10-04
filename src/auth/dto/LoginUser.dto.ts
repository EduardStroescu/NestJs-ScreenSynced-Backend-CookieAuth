import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

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
    format: 'password',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
