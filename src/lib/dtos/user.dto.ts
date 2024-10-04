import { ApiProperty } from '@nestjs/swagger';

export class PrivateUserDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  id: number;

  @ApiProperty({
    description: 'User email',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User display name',
    type: String,
  })
  displayName: string;

  @ApiProperty({
    description: 'User avatar URL',
    type: String,
  })
  avatar: string;

  @ApiProperty({
    description: 'Date of user creation',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date of last user account update',
    type: String,
  })
  updatedAt: string;
}
