import { ApiProperty } from '@nestjs/swagger';

export class HealthSuccessResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Instance is running' })
  message: string;
}

export class HealthErrorResponseDto {
  @ApiProperty({ example: 'error' })
  status: string;

  @ApiProperty({ example: 'Instance is not running' })
  message: string;
}
