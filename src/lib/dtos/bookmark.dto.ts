import { ApiProperty } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty({
    description: 'Bookmark ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Media ID from TMDB',
    type: Number,
  })
  mediaId: number;

  @ApiProperty({
    description: 'Media Type',
    type: String,
    enum: ['tv', 'movie'],
    example: ['movie', 'tv'],
  })
  mediaType: 'tv' | 'movie';

  @ApiProperty({
    description: 'User ID',
    type: Number,
  })
  userId: number;
}
