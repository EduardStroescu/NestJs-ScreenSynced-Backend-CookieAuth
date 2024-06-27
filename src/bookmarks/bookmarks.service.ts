import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/CreateBookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    try {
      return await this.prisma.bookmarks.create({
        data: {
          userId: userId,
          ...createBookmarkDto,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint failed
        throw new ConflictException('Bookmark already exists');
      }
      throw new HttpException(
        'An error occurred while creating bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookmarks(userId: number) {
    return await this.prisma.bookmarks.findMany({
      where: { userId: userId },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmarks.findUnique({
      where: { userId: userId, id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new NotFoundException('Bookmark not found');
    return bookmark;
  }

  async removeBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmarks.findUnique({
      where: { userId: userId, id: bookmarkId },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.bookmarks.delete({
      where: {
        userId: userId,
        id: bookmarkId,
      },
    });

    return { success: 'Bookmark deleted' };
  }
}
