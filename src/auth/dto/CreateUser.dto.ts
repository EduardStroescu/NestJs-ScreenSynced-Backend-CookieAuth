import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Used for the login process.',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  email: string;

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
    description: 'Displayed in the user profile.',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({
    type: String,
    format: 'base64',
    description: 'Base64 encoded avatar image file (optional)',
  })
  @IsOptional()
  avatar?: string;
}
