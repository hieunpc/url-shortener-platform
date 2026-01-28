# Setup MongoDB và Redis

## 1. Cài đặt MongoDB

### Windows:
```bash
# Download MongoDB Community Server từ: https://www.mongodb.com/try/download/community
# Hoặc dùng Chocolatey:
choco install mongodb

# Hoặc dùng Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 2. Cài đặt Redis

### Windows:
```bash
# Download từ: https://github.com/microsoftarchive/redis/releases
# Hoặc dùng Docker:
docker run -d -p 6379:6379 --name redis redis:latest
```

### macOS:
```bash
brew install redis
brew services start redis
```

### Linux (Ubuntu):
```bash
sudo apt-get install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

## 3. Sử dụng Docker Compose (Khuyên dùng!)

Tạo file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: url-shortener

  redis:
    image: redis:latest
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

Chạy:
```bash
docker-compose up -d
```

## 4. Kiểm tra kết nối

### MongoDB:
```bash
# Kết nối MongoDB shell
mongosh mongodb://localhost:27017/url-shortener

# Hoặc dùng MongoDB Compass (GUI): https://www.mongodb.com/try/download/compass
```

### Redis:
```bash
# Kết nối Redis CLI
redis-cli
> ping
PONG

# Xem tất cả keys
> KEYS *

# Xem giá trị của một key
> GET url:abc123
```

## 5. Chạy ứng dụng

```bash
# Đảm bảo MongoDB và Redis đang chạy
npm run start:dev
```

## 6. Configuration Options

Có thể thay đổi connection string trong `src/app.module.ts`:

### MongoDB:
```typescript
MongooseModule.forRoot('mongodb://localhost:27017/url-shortener', {
  user: 'username',     // Nếu có authentication
  pass: 'password',
  authSource: 'admin',
})
```

### Redis:
```typescript
CacheModule.registerAsync({
  useFactory: async () => ({
    store: await redisStore({
      socket: {
        host: 'localhost',
        port: 6379,
      },
      password: 'your-password',  // Nếu có
      ttl: 3600000, // TTL mặc định
    }),
  }),
})
```

## 7. Monitoring

### Xem MongoDB logs:
```bash
docker logs mongodb -f
```

### Xem Redis logs:
```bash
docker logs redis -f
```

### Xem Redis stats:
```bash
redis-cli info stats
```

## 8. Production Tips

- Sử dụng MongoDB Atlas (cloud) cho production
- Sử dụng Redis Cloud hoặc AWS ElastiCache
- Thêm authentication cho cả MongoDB và Redis
- Set up replica sets cho MongoDB
- Enable Redis persistence (RDB/AOF)
- Monitor performance với tools như MongoDB Compass, RedisInsight
