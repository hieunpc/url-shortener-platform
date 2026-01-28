import { Injectable, BadRequestException, NotFoundException, Inject, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name)
    private urlModel: Model<Url>,
    @Optional() // Make cache optional
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /**
   * Base62 encoding: Chuyển số sang chuỗi Base62
   * Dùng alphabet: 0-9, A-Z, a-z (62 ký tự)
   */
  private base62Encode(num: number): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (num === 0) return '0';
    
    let result = '';
    while (num > 0) {
      result = chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  /**
   * Tạo short code từ MongoDB ObjectId
   * Sử dụng Base62 encoding để có URL ngắn gọn
   */
  private generateShortCodeFromId(objectId: string): string {
    // Lấy 12 ký tự cuối của ObjectId (timestamp + counter)
    const hexString = objectId.substring(12, 24);
    // Chuyển hex sang số
    const num = parseInt(hexString, 16);
    // Encode sang Base62
    const encoded = this.base62Encode(num);
    // Đảm bảo độ dài tối thiểu 6 ký tự
    return encoded.padStart(6, '0');
  }

  /**
   * Tạo URL rút gọn với Base62 encoding
   */
  async createShortUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    let shortCode = createUrlDto.customCode;

    // Nếu user cung cấp customCode, kiểm tra trùng lặp
    if (shortCode) {
      const existing = await this.urlModel.findOne({ shortCode }).exec();
      if (existing) {
        throw new BadRequestException('Short code này đã được sử dụng');
      }
    }

    // Tạo document tạm để có ObjectId
    const url = new this.urlModel({
      shortCode: shortCode || 'temp', // Placeholder tạm thời
      originalUrl: createUrlDto.originalUrl,
    });

    // Nếu không có customCode, generate từ ObjectId bằng Base62
    if (!shortCode) {
      shortCode = this.generateShortCodeFromId(url._id.toString());
      url.shortCode = shortCode;
    }

    const savedUrl = await url.save();

    // Cache URL mapping if Redis is available (TTL: 1 hour)
    if (this.cacheManager) {
      try {
        await this.cacheManager.set(`url:${shortCode}`, createUrlDto.originalUrl, 3600000);
      } catch (error) {
        console.warn('Redis cache set failed:', error.message);
      }
    }

    return savedUrl;
  }

  /**
   * Tìm URL gốc từ shortCode và tăng click
   */
  async findByShortCode(shortCode: string): Promise<string> {
    // Kiểm tra cache trước (nếu Redis available)
    if (this.cacheManager) {
      try {
        const cachedUrl = await this.cacheManager.get<string>(`url:${shortCode}`);
        
        if (cachedUrl) {
          // Tăng clicks và update history trong background (không chờ)
          const today = new Date().toISOString().split('T')[0];
          
          // Simple approach: find and update in one go
          this.urlModel.findOne({ shortCode }).exec().then((url) => {
            if (url) {
              url.clickCount += 1;
              const historyIndex = url.clickHistory.findIndex(h => h.date === today);
              
              if (historyIndex >= 0) {
                url.clickHistory[historyIndex].count += 1;
              } else {
                url.clickHistory.push({ date: today, count: 1 });
              }
              
              url.save();
            }
          }).catch((err) => console.warn('Background click update failed:', err));
          
          return cachedUrl;
        }
      } catch (error) {
        console.warn('Redis cache get failed:', error.message);
      }
    }

    // Nếu không có trong cache hoặc Redis không available, query database
    const url = await this.urlModel.findOne({ shortCode }).exec();
    
    if (!url) {
      throw new NotFoundException('Short URL không tồn tại');
    }

    // Tăng số lượt click
    url.clickCount += 1;
    
    // Update daily click history
    const today = new Date().toISOString().split('T')[0];
    const historyIndex = url.clickHistory.findIndex(h => h.date === today);
    
    if (historyIndex >= 0) {
      url.clickHistory[historyIndex].count += 1;
    } else {
      url.clickHistory.push({ date: today, count: 1 });
    }
    
    await url.save();

    // Cache lại URL nếu Redis available (TTL: 1 hour)
    if (this.cacheManager) {
      try {
        await this.cacheManager.set(`url:${shortCode}`, url.originalUrl, 3600000);
      } catch (error) {
        console.warn('Redis cache set failed:', error.message);
      }
    }

    return url.originalUrl;
  }

  /**
   * Lấy thống kê của một URL
   */
  async getStats(shortCode: string): Promise<Url> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    
    if (!url) {
      throw new NotFoundException('Short URL không tồn tại');
    }

    return url;
  }

  /**
   * Lấy danh sách tất cả URLs
   */
  async findAll(): Promise<Url[]> {
    return this.urlModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Xóa URL theo ID và invalidate cache
   */
  async deleteUrlById(id: string): Promise<void> {
    const url = await this.urlModel.findById(id).exec();
    
    if (!url) {
      throw new NotFoundException('URL không tồn tại');
    }

    // Xóa khỏi database
    await this.urlModel.deleteOne({ _id: id }).exec();

    // Xóa cache nếu Redis available
    if (this.cacheManager) {
      try {
        await this.cacheManager.del(`url:${url.shortCode}`);
      } catch (error) {
        console.warn('Redis cache delete failed:', error.message);
      }
    }
  }

  /**
   * Xóa URL theo shortCode và invalidate cache
   */
  async deleteUrl(shortCode: string): Promise<void> {
    const result = await this.urlModel.deleteOne({ shortCode }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException('Short URL không tồn tại');
    }

    // Xóa cache nếu Redis available
    if (this.cacheManager) {
      try {
        await this.cacheManager.del(`url:${shortCode}`);
      } catch (error) {
        console.warn('Redis cache delete failed:', error.message);
      }
    }
  }
}
