import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Homepage HTML')
@Controller()
export class AppController {
  @ApiOkResponse({
    description: 'OK',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'HTML file not found',
    status: 404,
  })
  @ApiResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @Get()
  async getServerStatus(@Res() res: Response) {
    try {
      const filePath = join(process.cwd(), 'client', 'index.html');

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('HTML file not found');
      }

      // Set the appropriate headers
      res.setHeader('Content-Type', 'text/html');

      // Read and send the file
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
}
