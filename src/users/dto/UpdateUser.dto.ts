import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description:
      'Will be used for user login and profile display (if no displayName is provided).',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Will be displayed in the user profile if provided.',
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
