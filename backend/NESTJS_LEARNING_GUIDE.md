# 📚 Hướng Dẫn Học NestJS Từ Cơ Bản Đến Nâng Cao

## Mục Lục

1. [Giới Thiệu về NestJS](#1-giới-thiệu-về-nestjs)
2. [Cài Đặt và Thiết Lập](#2-cài-đặt-và-thiết-lập)
3. [Kiến Trúc và Concepts Cơ Bản](#3-kiến-trúc-và-concepts-cơ-bản)
4. [Controllers](#4-controllers)
5. [Providers và Dependency Injection](#5-providers-và-dependency-injection)
6. [Modules](#6-modules)
7. [DTOs và Validation](#7-dtos-và-validation)
8. [Middleware](#8-middleware)
9. [Exception Filters](#9-exception-filters)
10. [Pipes](#10-pipes)
11. [Guards](#11-guards)
12. [Interceptors](#12-interceptors)
13. [Database Integration](#13-database-integration)
14. [Authentication & Authorization](#14-authentication--authorization)
15. [Testing](#15-testing)
16. [Best Practices](#16-best-practices)

---

## 1. Giới Thiệu về NestJS

### NestJS là gì?

NestJS là một framework Node.js progressive được xây dựng trên TypeScript, sử dụng kiến trúc hướng module và hỗ trợ đầy đủ OOP (Object Oriented Programming), FP (Functional Programming), và FRP (Functional Reactive Programming).

### Đặc điểm nổi bật:

- ✅ **TypeScript First**: Hỗ trợ TypeScript mạnh mẽ
- ✅ **Kiến trúc Module**: Tổ chức code rõ ràng, dễ bảo trì
- ✅ **Dependency Injection**: Quản lý dependencies hiệu quả
- ✅ **Scalable**: Phù hợp cho cả dự án nhỏ và enterprise
- ✅ **Platform Independent**: Có thể dùng Express hoặc Fastify
- ✅ **Testing Friendly**: Hỗ trợ testing tốt với Jest

### Khi nào nên dùng NestJS?

- Dự án enterprise cần kiến trúc rõ ràng
- Team lớn cần convention và structure chặt chẽ
- Ứng dụng cần scale tốt
- Microservices architecture

---

## 2. Cài Đặt và Thiết Lập

### Yêu cầu:

- Node.js (v16 hoặc cao hơn)
- npm hoặc yarn

### Cài đặt Nest CLI:

```bash
npm install -g @nestjs/cli
```

### Tạo project mới:

```bash
nest new project-name
```

### Cấu trúc project cơ bản:

```
src/
├── app.controller.ts       # Controller chính
├── app.controller.spec.ts  # Unit test cho controller
├── app.module.ts           # Root module
├── app.service.ts          # Service chính
└── main.ts                 # Entry point của app
```

### Chạy ứng dụng:

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

---

## 3. Kiến Trúc và Concepts Cơ Bản

### Kiến trúc 3 lớp chính:

```
Client Request
      ↓
  Controller (Nhận request, trả response)
      ↓
   Service (Business logic)
      ↓
  Repository (Data access)
```

### Request Lifecycle:

```
Request → Middleware → Guards → Interceptors (before)
→ Pipes → Controller → Service → Interceptors (after)
→ Exception Filters → Response
```

---

## 4. Controllers

### Controllers là gì?

Controllers chịu trách nhiệm xử lý incoming requests và trả về responses cho client.

### Tạo controller:

```bash
nest g controller tasks
```

### Ví dụ cơ bản:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  getAllTasks() {
    return 'Lấy tất cả tasks';
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return `Lấy task có id: ${id}`;
  }

  @Post()
  createTask(@Body() body: any) {
    return `Tạo task mới: ${JSON.stringify(body)}`;
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    return `Cập nhật task ${id}`;
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return `Xóa task ${id}`;
  }
}
```

### HTTP Decorators:

- `@Get()` - GET request
- `@Post()` - POST request
- `@Put()` - PUT request (cập nhật toàn bộ)
- `@Patch()` - PATCH request (cập nhật một phần)
- `@Delete()` - DELETE request

### Parameter Decorators:

- `@Param(key?: string)` - Route parameters
- `@Body(key?: string)` - Request body
- `@Query(key?: string)` - Query parameters
- `@Headers(name?: string)` - Request headers
- `@Req()` - Request object
- `@Res()` - Response object

---

## 5. Providers và Dependency Injection

### Providers là gì?

Providers là các classes có thể inject dependencies. Service là loại provider phổ biến nhất.

### Tạo service:

```bash
nest g service tasks
```

### Ví dụ Service:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [];

  getAllTasks() {
    return this.tasks;
  }

  getTaskById(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task với ID ${id} không tồn tại`);
    }
    return task;
  }

  createTask(title: string, description: string) {
    const task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'OPEN',
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string) {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
```

### Inject Service vào Controller:

```typescript
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }
}
```

### Dependency Injection Scopes:

- **DEFAULT**: Singleton - một instance duy nhất trong toàn app
- **REQUEST**: Instance mới cho mỗi request
- **TRANSIENT**: Instance mới mỗi khi inject

```typescript
@Injectable({ scope: Scope.REQUEST })
export class TasksService {}
```

---

## 6. Modules

### Modules là gì?

Module là một class được decorate bởi `@Module()`, tổ chức code thành các functional units.

### Tạo module:

```bash
nest g module tasks
```

### Ví dụ Module:

```typescript
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService], // Export để module khác có thể dùng
})
export class TasksModule {}
```

### Module Properties:

- **providers**: Các providers sẽ được instantiated bởi Nest injector
- **controllers**: Các controllers được định nghĩa trong module
- **imports**: Các modules khác mà module này cần
- **exports**: Providers có thể sử dụng bởi modules khác

### Shared Modules:

```typescript
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

// Sử dụng trong module khác
@Module({
  imports: [CommonModule],
  controllers: [TasksController],
})
export class TasksModule {}
```

### Global Modules:

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

---

## 7. DTOs và Validation

### DTOs (Data Transfer Objects) là gì?

DTOs định nghĩa cấu trúc data được gửi trong network requests.

### Cài đặt validation packages:

```bash
npm install class-validator class-transformer
```

### Ví dụ DTO:

```typescript
// create-task.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
```

### Sử dụng DTO trong Controller:

```typescript
@Post()
createTask(@Body() createTaskDto: CreateTaskDto) {
  return this.tasksService.createTask(createTaskDto);
}
```

### Enable global validation:

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ properties không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có properties không hợp lệ
      transform: true, // Tự động transform payload thành DTO instance
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

### Validation Decorators phổ biến:

- `@IsString()` - Kiểm tra string
- `@IsNumber()` - Kiểm tra number
- `@IsEmail()` - Kiểm tra email
- `@IsEnum(enum)` - Kiểm tra enum value
- `@IsNotEmpty()` - Không được rỗng
- `@IsOptional()` - Field optional
- `@MinLength(n)` - Độ dài tối thiểu
- `@MaxLength(n)` - Độ dài tối đa
- `@Min(n)` - Giá trị tối thiểu
- `@Max(n)` - Giá trị tối đa
- `@IsArray()` - Kiểm tra array
- `@IsBoolean()` - Kiểm tra boolean

---

## 8. Middleware

### Middleware là gì?

Middleware là functions được gọi trước route handler, có thể access request và response objects.

### Tạo middleware:

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

### Apply middleware:

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [TasksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('tasks'); // Áp dụng cho route 'tasks'

    // Hoặc áp dụng cho tất cả routes
    // .forRoutes('*');

    // Hoặc áp dụng cho specific controller
    // .forRoutes(TasksController);
  }
}
```

### Functional Middleware:

```typescript
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}

// Apply
consumer.apply(logger).forRoutes('*');
```

---

## 9. Exception Filters

### Built-in HTTP Exceptions:

NestJS cung cấp nhiều exception classes:

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

@Get(':id')
getTaskById(@Param('id') id: string) {
  const task = this.tasksService.getTaskById(id);
  if (!task) {
    throw new NotFoundException(`Task với ID ${id} không tồn tại`);
  }
  return task;
}
```

### Custom Exception Filter:

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exceptionResponse['message'] || exception.message,
    });
  }
}
```

### Apply Exception Filter:

```typescript
// Globally
app.useGlobalFilters(new HttpExceptionFilter());

// Controller level
@UseFilters(HttpExceptionFilter)
@Controller('tasks')
export class TasksController {}

// Method level
@Get()
@UseFilters(HttpExceptionFilter)
getAllTasks() {}
```

---

## 10. Pipes

### Pipes là gì?

Pipes transform hoặc validate input data trước khi đến route handler.

### Built-in Pipes:

- `ValidationPipe` - Validate request data
- `ParseIntPipe` - Transform string thành integer
- `ParseBoolPipe` - Transform string thành boolean
- `ParseArrayPipe` - Transform string thành array
- `ParseUUIDPipe` - Validate UUID

### Sử dụng Built-in Pipes:

```typescript
@Get(':id')
getTaskById(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.getTaskById(id);
}
```

### Custom Pipe:

```typescript
// task-status-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" không phải status hợp lệ`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status);
  }
}
```

### Sử dụng Custom Pipe:

```typescript
@Patch(':id/status')
updateTaskStatus(
  @Param('id') id: string,
  @Body('status', TaskStatusValidationPipe) status: TaskStatus,
) {
  return this.tasksService.updateTaskStatus(id, status);
}
```

---

## 11. Guards

### Guards là gì?

Guards quyết định request có được xử lý bởi route handler hay không (Authorization).

### Tạo Guard:

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    // Validate token
    return this.validateToken(token);
  }

  private validateToken(token: string): boolean {
    // Logic xác thực token
    return token === 'valid-token';
  }
}
```

### Apply Guard:

```typescript
// Globally
app.useGlobalGuards(new AuthGuard());

// Controller level
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {}

// Method level
@Get()
@UseGuards(AuthGuard)
getAllTasks() {}
```

### Role-based Guard:

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.some(role => user.roles?.includes(role));
  }
}

// Sử dụng
@Post()
@Roles('admin')
@UseGuards(RolesGuard)
createTask() {}
```

---

## 12. Interceptors

### Interceptors là gì?

Interceptors có thể:

- Bind thêm logic trước/sau method execution
- Transform kết quả trả về từ function
- Transform exception
- Extend basic function behavior
- Override function (caching)

### Tạo Interceptor:

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

### Transform Response Interceptor:

```typescript
// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
        success: true,
      })),
    );
  }
}
```

### Apply Interceptor:

```typescript
// Globally
app.useGlobalInterceptors(new LoggingInterceptor());

// Controller level
@UseInterceptors(LoggingInterceptor)
@Controller('tasks')
export class TasksController {}

// Method level
@Get()
@UseInterceptors(LoggingInterceptor)
getAllTasks() {}
```

---

## 13. Database Integration

### TypeORM với PostgreSQL:

#### Cài đặt:

```bash
npm install @nestjs/typeorm typeorm pg
```

#### Cấu hình:

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'taskmanagement',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Chỉ dùng trong development
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

#### Tạo Entity:

```typescript
// task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

#### Repository Pattern:

```typescript
// tasks.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

// tasks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task với ID ${id} không tồn tại`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task với ID ${id} không tồn tại`);
    }
  }
}
```

### Mongoose với MongoDB:

#### Cài đặt:

```bash
npm install @nestjs/mongoose mongoose
```

#### Cấu hình:

```typescript
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/taskmanagement'),
    TasksModule,
  ],
})
export class AppModule {}
```

#### Schema:

```typescript
// task.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
```

---

## 14. Authentication & Authorization

### JWT Authentication:

#### Cài đặt:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### User Entity:

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
```

#### Auth Module:

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

#### Auth Service:

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Username hoặc password không đúng');
    }
  }
}
```

#### JWT Strategy:

```typescript
// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: any): Promise<User> {
    const { username } = payload;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

#### Sử dụng Auth Guard:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  // Tất cả routes đều cần authentication
}
```

#### Get User từ Request:

```typescript
import { GetUser } from './get-user.decorator';

// get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

// Sử dụng
@Get()
getAllTasks(@GetUser() user: User) {
  return this.tasksService.getAllTasks(user);
}
```

---

## 15. Testing

### Unit Testing:

#### Test Service:

```typescript
// tasks.service.spec.ts
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      tasksRepository.find.mockResolvedValue(mockTasks);

      const result = await tasksService.getAllTasks();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should retrieve a task by id', async () => {
      const mockTask = { id: '1', title: 'Test Task' };
      tasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(tasksService.getTaskById('1')).rejects.toThrow();
    });
  });
});
```

#### Test Controller:

```typescript
// tasks.controller.spec.ts
import { Test } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getAllTasks: jest.fn(),
            getTaskById: jest.fn(),
            createTask: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      tasksService.getAllTasks.mockResolvedValue(mockTasks);

      const result = await tasksController.getAllTasks();
      expect(result).toEqual(mockTasks);
    });
  });
});
```

### E2E Testing:

```typescript
// test/tasks.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Test Task', description: 'Test Description' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
      });
  });
});
```

### Chạy tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 16. Best Practices

### 1. **Structure tốt**

```
src/
├── common/               # Shared code
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/              # Configuration
├── modules/             # Feature modules
│   ├── auth/
│   ├── users/
│   └── tasks/
└── main.ts
```

### 2. **Environment Configuration**

```bash
npm install @nestjs/config
```

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
})
export class AppModule {}
```

### 3. **Logging**

```typescript
import { Logger } from '@nestjs/common';

export class TasksService {
  private logger = new Logger('TasksService');

  async getAllTasks() {
    this.logger.log('Fetching all tasks');
    // ...
  }
}
```

### 4. **Error Handling**

- Luôn sử dụng built-in exceptions
- Tạo custom exceptions khi cần
- Implement global exception filter

### 5. **Security**

```bash
npm install helmet
npm install @nestjs/throttler
```

```typescript
// main.ts
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';

app.use(helmet());

// Rate limiting
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
export class AppModule {}
```

### 6. **Validation và Transformation**

- Luôn validate input data
- Sử dụng DTOs cho tất cả requests
- Transform data khi cần

### 7. **Documentation với Swagger**

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Tasks API')
  .setDescription('The tasks API description')
  .setVersion('1.0')
  .addTag('tasks')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### 8. **Database Best Practices**

- Sử dụng migrations trong production
- Tạo indexes cho các trường thường query
- Sử dụng transactions khi cần
- Implement soft delete

### 9. **Testing Best Practices**

- Aim for >80% code coverage
- Mock dependencies trong unit tests
- Test happy path và edge cases
- Write E2E tests cho critical flows

### 10. **Performance**

- Enable compression
- Implement caching
- Use pagination cho large datasets
- Optimize database queries

---

## 📚 Tài Liệu Tham Khảo

### Official Documentation:

- [NestJS Official Docs](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Mongoose Documentation](https://mongoosejs.com)

### Video Courses:

- NestJS Zero to Hero - Udemy
- NestJS Fundamentals - Official NestJS

### GitHub Repositories:

- [Awesome NestJS](https://github.com/nestjs/awesome-nestjs)
- [NestJS Examples](https://github.com/nestjs/nest/tree/master/sample)

---

## 🎯 Lộ Trình Học Tập Đề Xuất

### Tuần 1-2: Basics

- [ ] Setup environment
- [ ] Hiểu Controllers, Services, Modules
- [ ] Làm việc với DTOs và Validation
- [ ] CRUD operations cơ bản

### Tuần 3-4: Intermediate

- [ ] Database integration (TypeORM/Mongoose)
- [ ] Authentication & Authorization
- [ ] Middleware, Guards, Pipes
- [ ] Exception handling

### Tuần 5-6: Advanced

- [ ] Interceptors
- [ ] Custom decorators
- [ ] Testing (Unit & E2E)
- [ ] Microservices basics

### Tuần 7-8: Production Ready

- [ ] Configuration management
- [ ] Logging & monitoring
- [ ] Security best practices
- [ ] Deployment
- [ ] Performance optimization

---

## 💡 Tips Học Tập

1. **Practice by building**: Xây dựng các projects thực tế
2. **Read source code**: Đọc source code của NestJS
3. **Join community**: Tham gia NestJS Discord/Reddit
4. **Stay updated**: Follow NestJS blog và changelogs
5. **Compare with others**: So sánh với Express.js để hiểu rõ benefits

---

## 🚀 Project Ideas để Practice

### Beginner:

1. **Todo API**: CRUD operations cơ bản
2. **Blog API**: Posts, comments, users
3. **Notes App**: Categories, tags, search

### Intermediate:

1. **E-commerce API**: Products, cart, orders, payment
2. **Social Media API**: Posts, likes, comments, follow
3. **Task Management**: Teams, projects, tasks, time tracking

### Advanced:

1. **Real-time Chat**: WebSockets, rooms, notifications
2. **Microservices**: Split monolith into services
3. **GraphQL API**: Replace REST with GraphQL

---

Chúc bạn học tập tốt! 🎉
