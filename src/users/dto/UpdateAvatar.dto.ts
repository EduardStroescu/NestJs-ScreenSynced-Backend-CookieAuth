import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAvatarDto {
  @ApiProperty({
    type: String,
    format: 'base64',
    description: 'Base64 encoded avatar image file (required).',
  })
  @IsNotEmpty()
  avatar: string;
}
