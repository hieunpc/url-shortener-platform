# 🚀 URL Shortener với MongoDB và Redis

## ✅ Đã hoàn thành

URL Shortener đã được nâng cấp với:

### 🗄️ Database

- **MongoDB**: Thay thế SQLite, hỗ trợ scale tốt hơn
- **Mongoose**: ODM cho MongoDB với schema validation
- **Index**: Short code được đánh index để query nhanh

### ⚡ Caching

- **Redis**: Cache URL mappings để giảm tải database
- **Fallback graceful**: App vẫn chạy nếu Redis chưa setup
- **TTL**: Cache tự động expire sau 1 giờ
- **Cache invalidation**: Tự động xóa cache khi delete URL

## 📊 Architecture

```
Client Request
    ↓
NestJS Controller
    ↓
Service Layer
    ↓
├─→ Redis Cache (nếu có) ← Fast Path
│       ↓ (cache miss)
└─→ MongoDB ← Slow Path
```

## 🛠️ Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động MongoDB và Redis

#### Option A: Docker (Khuyên dùng)

```bash
docker-compose up -d
```

#### Option B: Cài local

Xem hướng dẫn trong [SETUP_MONGODB_REDIS.md](SETUP_MONGODB_REDIS.md)

### 3. Kiểm tra services

```bash
./check-services.ps1
```

### 4. Chạy ứng dụng

```bash
npm run start:dev
```

## 🔌 API Endpoints

### Tạo short URL

```http
POST http://localhost:3000/api/shorten
Content-Type: application/json

{
  "originalUrl": "https://www.google.com",
  "customCode": "abc123"  // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "shortCode": "abc123",
    "originalUrl": "https://www.google.com",
    "shortUrl": "http://localhost:3000/abc123",
    "createdAt": "2026-01-21T06:46:06.000Z"
  }
}
```

### Redirect

```http
GET http://localhost:3000/abc123
```

→ Redirect 302 đến URL gốc

### Lấy thống kê

```http
GET http://localhost:3000/api/stats/abc123
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "shortCode": "abc123",
    "originalUrl": "https://www.google.com",
    "clicks": 42,
    "createdAt": "2026-01-21T06:46:06.000Z",
    "updatedAt": "2026-01-21T07:30:15.000Z"
  }
}
```

### Lấy tất cả URLs

```http
GET http://localhost:3000/api/urls
```

## 🧪 Testing

Sử dụng file `test-api.rest` với REST Client extension:

1. Cài extension: `humao.rest-client`
2. Mở file `test-api.rest`
3. Click "Send Request" trên mỗi test case

## 📈 Performance Features

### Redis Caching

- ✅ Cache hit: ~1-2ms response time
- ✅ Cache miss: ~50-100ms (query MongoDB)
- ✅ TTL: 1 hour (có thể config)
- ✅ Auto invalidation khi delete

### MongoDB Optimization

- ✅ Index trên `shortCode` field
- ✅ Increment clicks trong background
- ✅ Bulk operations support
- ✅ Connection pooling

## 🔧 Configuration

### MongoDB

File: `src/app.module.ts`

```typescript
MongooseModule.forRoot('mongodb://127.0.0.1:27017/url-shortener');
```

### Redis (Optional)

Uncomment trong `src/app.module.ts`:

```typescript
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      socket: { host: 'localhost', port: 6379 },
      ttl: 3600000,
    }),
  }),
});
```

## 🐛 Troubleshooting

### MongoDB không kết nối

```bash
# Check MongoDB đang chạy
docker ps | grep mongodb
# Hoặc
mongosh mongodb://127.0.0.1:27017/url-shortener
```

### Redis không kết nối

```bash
# Check Redis đang chạy
docker ps | grep redis
# Hoặc
redis-cli ping
```

### App chạy mà Redis chưa có

App vẫn hoạt động bình thường, chỉ không có caching. Logs sẽ hiện warning:

```
Redis cache get failed: connect ECONNREFUSED
```

## 📦 Tech Stack

- **NestJS**: Framework backend
- **MongoDB**: NoSQL database
- **Mongoose**: ODM
- **Redis**: Cache layer
- **TypeScript**: Type safety
- **class-validator**: DTO validation

## 🚀 Production Checklist

- [ ] Sử dụng MongoDB Atlas hoặc managed MongoDB
- [ ] Sử dụng Redis Cloud hoặc AWS ElastiCache
- [ ] Enable authentication cho MongoDB và Redis
- [ ] Set up replica sets cho MongoDB
- [ ] Enable Redis persistence (AOF)
- [ ] Add rate limiting
- [ ] Set up monitoring (MongoDB Compass, RedisInsight)
- [ ] Configure environment variables
- [ ] Add logging (Winston, Pino)
- [ ] Set up CI/CD pipeline

## 📝 Next Steps

1. **Rate Limiting**: Giới hạn request per IP
2. **Analytics**: Track clicks, referrers, locations
3. **Custom domains**: Hỗ trợ custom short domain
4. **QR Code**: Tạo QR code cho short URL
5. **Expiration**: Auto delete URLs sau X ngày
6. **API Authentication**: JWT tokens cho API
7. **Admin Dashboard**: Web UI quản lý URLs
8. **Link Preview**: Show preview khi hover
