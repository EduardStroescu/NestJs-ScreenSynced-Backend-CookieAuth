import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthErrorResponseDto,
  HealthSuccessResponseDto,
} from './dto/HealthResponseDto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor() {}

  @ApiOkResponse({
    description: 'Instance is running',
    type: HealthSuccessResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Instance is not running. Please try again later',
    type: HealthErrorResponseDto,
  })
  @Get()
  async ping() {
    return { status: 'success', message: 'Instance is running' };
  }
}
