# 📘 Hướng dẫn hiện thực Web App URL Shortener (NestJS)

## Mục tiêu

Xây dựng một web app rút gọn URL cơ bản, có API và trang web đơn giản để:

- Tạo short URL
- Chuyển hướng từ short URL về URL gốc
- Xem thống kê lượt click (tuỳ chọn)

---

## 1. Kiến trúc tổng quan

### Core flow

```
Client → POST /shorten → Server tạo mã → Lưu DB → Trả về short URL
Client → GET /:code → Server tìm URL gốc → Redirect 301/302
```

### Các thành phần chính

- **Controller**: nhận request API
- **Service**: xử lý business logic (tạo code, redirect)
- **Repository/DB**: lưu URL
- **Validation**: kiểm tra input

---

## 2. Cấu trúc project đề xuất

```
src/
├── app.module.ts
├── main.ts
├── urls/
│   ├── urls.controller.ts
│   ├── urls.service.ts
│   ├── urls.module.ts
│   ├── dto/
│   │   └── create-url.dto.ts
│   ├── entities/
│   │   └── url.entity.ts
│   └── urls.repository.ts (optional)
```

---

## 3. Cài đặt dependencies

```bash
npm install @nestjs/typeorm typeorm sqlite3 class-validator class-transformer
```

> Dùng SQLite để đơn giản. Khi deploy, có thể chuyển sang PostgreSQL/MySQL.

---

## 4. Định nghĩa Entity

```ts
// src/urls/entities/url.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  shortCode: string;

  @Column('text')
  originalUrl: string;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 5. DTO validation

```ts
// src/urls/dto/create-url.dto.ts
import { IsUrl, IsOptional, Length } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @Length(4, 10)
  customCode?: string;
}
```

---

## 6. Service Logic

```ts
// src/urls/urls.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  private generateCode(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createShortUrl(dto: CreateUrlDto): Promise<Url> {
    const shortCode = dto.customCode || this.generateCode();

    const exists = await this.urlRepository.findOne({ where: { shortCode } });
    if (exists) throw new ConflictException('Short code đã tồn tại');

    const url = this.urlRepository.create({
      shortCode,
      originalUrl: dto.originalUrl,
    });

    return await this.urlRepository.save(url);
  }

  async getOriginalUrl(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) throw new NotFoundException('Short URL không tồn tại');

    url.clicks++;
    await this.urlRepository.save(url);
    return url;
  }

  async getStats(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) throw new NotFoundException('Short URL không tồn tại');
    return url;
  }
}
```

---

## 7. Controller

```ts
// src/urls/urls.controller.ts
import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  create(@Body() dto: CreateUrlDto) {
    return this.urlsService.createShortUrl(dto);
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const url = await this.urlsService.getOriginalUrl(code);
    return res.redirect(url.originalUrl);
  }

  @Get('stats/:code')
  stats(@Param('code') code: string) {
    return this.urlsService.getStats(code);
  }
}
```

---

## 8. Module Setup

```ts
// src/urls/urls.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { Url } from './entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
```

---

## 9. App Module & DB Config

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsModule } from './urls/urls.module';
import { Url } from './urls/entities/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'urls.db',
      entities: [Url],
      synchronize: true,
    }),
    UrlsModule,
  ],
})
export class AppModule {}
```

---

## 10. Validation global

```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

---

## 11. API demo

### Tạo short URL

```
POST /shorten
{
  "originalUrl": "https://github.com"
}
```

Response:

```
{
  "id": "uuid",
  "shortCode": "Ab12xY",
  "originalUrl": "https://github.com",
  "clicks": 0,
  "createdAt": "2026-01-16T00:00:00.000Z"
}
```

### Redirect

```
GET /Ab12xY
→ Redirect to https://github.com
```

### Stats

```
GET /stats/Ab12xY
```

---

## 12. UI đơn giản (Optional)

Tạo 1 view HTML hoặc dùng React/Vue để gọi API:

- Input URL → gọi `/shorten`
- Hiển thị short link
- Copy button

---

## 13. Nâng cao (hướng dẫn chi tiết)

### 13.1. Custom domain

**Mục tiêu**: trả về short URL dạng `https://s.domain.com/Ab12xY`.

**Cách làm**

1. Thêm biến môi trường `BASE_URL` (vd: `https://s.domain.com`).
2. Khi trả response tạo short URL, nối `${BASE_URL}/${shortCode}`.

**Gợi ý code**

- Trong `UrlsService.createShortUrl()`, sau khi lưu URL, trả thêm field `shortUrl`.
- Dùng `@nestjs/config` để đọc `BASE_URL`.

---

### 13.2. Expire URL (TTL)

**Mục tiêu**: URL hết hạn sau thời gian định trước.

**Cách làm**

1. Thêm field `expiresAt: Date | null` vào Entity.
2. Trong DTO, cho phép client gửi `expiresAt` hoặc `ttlInMinutes`.
3. Khi redirect, kiểm tra `expiresAt < now` → trả lỗi 410 (Gone).

**Gợi ý code**

- Entity thêm cột `@Column({ type: 'datetime', nullable: true }) expiresAt: Date;`
- Thêm endpoint `POST /shorten` hỗ trợ TTL:
  - Nếu có `ttlInMinutes`, set `expiresAt = now + ttl`.
- Trong `getOriginalUrl()`, nếu hết hạn thì throw `GoneException`.

---

### 13.3. Rate limiting

**Mục tiêu**: chống spam tạo URL.

**Cách làm**

1. Cài `@nestjs/throttler`.
2. Cấu hình TTL/limit toàn cục hoặc per-route.

**Gợi ý code**

```ts
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({ ttl: 60, limit: 20 });

// urls.controller.ts
import { Throttle } from '@nestjs/throttler';

@Post('shorten')
@Throttle({ ttl: 60, limit: 5 })
```

---

### 13.4. Analytics (device, referrer)

**Mục tiêu**: lưu metadata cho mỗi click.

**Cách làm**

1. Tạo bảng `UrlClick` hoặc lưu logs vào DB.
2. Lấy `User-Agent`, `Referer`, IP từ request.
3. Nếu traffic lớn, ghi vào Redis/Queue để xử lý async.

**Gợi ý code**

- Tạo entity `UrlClick` gồm `urlId`, `userAgent`, `referrer`, `ip`, `createdAt`.
- Trong `redirect()`, trước khi `res.redirect`, ghi log click.

---

### 13.5. User auth + quản lý URL

**Mục tiêu**: mỗi user có danh sách URL riêng.

**Cách làm**

1. Implement JWT auth (AuthModule).
2. Gắn `ownerId` vào `Url`.
3. Các endpoint `/shorten`, `/stats`, `/list` yêu cầu auth.

**Gợi ý code**

- `Url` thêm `@Column() ownerId: string;`
- Trong controller, dùng decorator `@GetUser()` để lấy user.
- Query theo `ownerId` để filter.

---

### 13.6. Redis cache

**Mục tiêu**: tăng tốc redirect.

**Cách làm**

1. Cài `@nestjs/cache-manager` và `cache-manager-redis-store`.
2. Cache mapping `shortCode → originalUrl`.
3. Khi redirect: check cache → DB → set cache.

**Gợi ý code**

```ts
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

CacheModule.register({
  isGlobal: true,
  store: redisStore,
  url: process.env.REDIS_URL,
  ttl: 3600,
});

// urls.service.ts
import { Inject, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
```

---

### 13.7. Background jobs

**Mục tiêu**: xử lý analytics, cleanup URL hết hạn.

**Cách làm**

1. Cài `@nestjs/bull` hoặc `@nestjs/bullmq` + Redis.
2. Tạo job `track-click` và `cleanup-expired`.
3. Lên lịch cleanup bằng cron (`@nestjs/schedule`).

**Gợi ý code**

```ts
// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

ScheduleModule.forRoot();

// cleanup.service.ts
import { Cron } from '@nestjs/schedule';

@Cron('0 0 * * *') // mỗi ngày
async handleCleanup() {}
```

---

## 14. Checklist hoàn chỉnh

- [ ] CRUD URL
- [ ] Redirect
- [ ] Validation
- [ ] DB persistence
- [ ] Error handling
- [ ] API docs (Swagger)

---

Nếu bạn muốn, tôi có thể tạo sẵn toàn bộ code trong project của bạn luôn.
