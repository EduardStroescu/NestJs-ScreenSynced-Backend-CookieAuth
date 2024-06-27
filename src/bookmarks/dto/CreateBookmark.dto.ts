import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    type: Number,
    description:
      'This is a required property. Comes from the id from the TMDB api.',
  })
  @Type(() => Number)
  @IsInt()
  mediaId: number;

  @ApiProperty({
    type: String,
    description:
      'This is a required property. It can be either "tv" or "movie" depending on the media type.',
    enum: ['tv', 'movie'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['tv', 'movie'])
  mediaType: 'tv' | 'movie';
}
