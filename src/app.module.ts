import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/', {
      dbName: 'auth',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            },
            {
              target: 'pino-mongodb',
              level: 'info',
              options: {
                uri: 'mongodb://root:example@localhost:27017/',
                database: 'auth',
                collection: 'logs',
              },
            },
          ],
        },
      },
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      // username: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      isGlobal: true,
      socket: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
