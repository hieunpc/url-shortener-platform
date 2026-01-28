import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TasksModule } from './tasks/tasks.module';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // MongoDB Configuration
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/url-shortener', {
      // Các options cho production
      // retryAttempts: 3,
      // retryDelay: 1000,
    }),
    
    // Redis Cache Configuration
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 3600000, // Default TTL: 1 hour (milliseconds)
        }),
      }),
    }),
    
    UrlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
