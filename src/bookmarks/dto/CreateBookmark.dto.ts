import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    type: Number,
    description:
      'This is a required property. It Represents the id from the TMDB API.',
  })
  @Type(() => Number)
  @IsInt()
  mediaId: number;

  @ApiProperty({
    type: String,
    description:
      'This is a required property. It can be either "tv" or "movie" depending on the media type.',
    enum: ['tv', 'movie'],
    example: ['movie', 'tv'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['tv', 'movie'])
  mediaType: 'tv' | 'movie';
}
