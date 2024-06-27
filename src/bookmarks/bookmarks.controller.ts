import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtGuard } from '../auth/guards';
import { GetUser } from '../auth/decorator/GetUser.decorator';
import { CreateBookmarkDto } from './dto/CreateBookmark.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Bookmarks')
@UseGuards(JwtGuard)
@ApiCookieAuth()
@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'Bookmark Created',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Post()
  async createBookmark(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid jwt bearer access token',
    status: 401,
  })
  @Get()
  async getBookmarks(@GetUser('id', ParseIntPipe) userId: number) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Bookmark Not Found',
  })
  @Get(':id')
  async getBookmarkById(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarksService.getBookmarkById(userId, bookmarkId);
  }

  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiNotFoundResponse({
    description: 'Bookmark Not Found',
  })
  @Delete(':id')
  async deleteBookmarkById(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarksService.removeBookmarkById(userId, bookmarkId);
  }
}
