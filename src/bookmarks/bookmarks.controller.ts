import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BookmarkDto } from '../lib/dtos/bookmark.dto';

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
  @ApiConflictResponse({
    description: 'Bookmark already exists',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while creating bookmark',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBookmark(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'All bookmarks fetched',
    type: [BookmarkDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid jwt bearer access token',
    status: 401,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving bookmarks',
  })
  @Get()
  async getBookmarks(@GetUser('id', ParseIntPipe) userId: number) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Bookmark fetched',
    type: BookmarkDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Bookmark Not Found',
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
    description: 'Bookmark Deleted',
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
