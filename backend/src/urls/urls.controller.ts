import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
  Req,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  /**
   * POST /api/shorten
   * Tạo URL rút gọn
   */
  @Post('api/shorten')
  async createShortUrl(
    @Body(ValidationPipe) createUrlDto: CreateUrlDto,
    @Req() req: Request,
  ) {
    const url = await this.urlsService.createShortUrl(createUrlDto);
    
    // Generate base URL: prioritize env variable, fallback to request
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    
    return {
      success: true,
      data: {
        id: url.id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clickCount: url.clickCount || 0,
        clickHistory: url.clickHistory || [],
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    };
  }

  /**
   * GET /api/urls
   * Lấy danh sách tất cả URLs
   */
  @Get('api/urls')
  async getAllUrls() {
    const urls = await this.urlsService.findAll();
    // Transform _id to id for frontend compatibility
    const transformedUrls = urls.map((url) => ({
      id: url._id.toString(),
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount || 0,
      clickHistory: url.clickHistory || [],
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
    return {
      success: true,
      data: transformedUrls,
    };
  }

  /**
   * GET /api/stats/:shortCode
   * Lấy thống kê của một URL
   */
  @Get('api/stats/:shortCode')
  async getStats(@Param('shortCode') shortCode: string) {
    const url = await this.urlsService.getStats(shortCode);
    return {
      success: true,
      data: {
        id: url._id.toString(),
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clickCount: url.clickCount || 0,
        clickHistory: url.clickHistory || [],
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    };
  }

  /**
   * DELETE /api/urls/:id
   * Xóa URL theo ID
   */
  @Delete('api/urls/:id')
  async deleteUrl(@Param('id') id: string) {
    await this.urlsService.deleteUrlById(id);
    return {
      success: true,
      message: 'URL deleted successfully',
    };
  }

  /**
   * GET /:shortCode
   * Redirect từ short URL về URL gốc
   */
  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlsService.findByShortCode(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
