import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
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
      throw new InternalServerErrorException(
        'An error occurred while creating bookmark',
      );
    }
  }

  async getBookmarks(userId: number) {
    try {
      return await this.prisma.bookmarks.findMany({
        where: { userId: userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving bookmarks',
      );
    }
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    try {
      const bookmark = await this.prisma.bookmarks.findUnique({
        where: { userId: userId, id: bookmarkId },
      });
      if (!bookmark || bookmark.userId !== userId)
        throw new NotFoundException('Bookmark not found');
      return bookmark;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving bookmark',
      );
    }
  }

  async removeBookmarkById(userId: number, bookmarkId: number) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting bookmark',
      );
    }
  }
}
