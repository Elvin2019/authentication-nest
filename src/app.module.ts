import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('DATABASE_URI'),
          dbName: configService.get('DATABASE_NAME'),
        };
      },

      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
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
                  uri: configService.get('DATABASE_URI'),
                  database: configService.get('DATABASE_NAME'),
                  collection: 'logs',
                },
              },
            ],
          },
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        password: configService.get('REDIS_PASSWORD'),
        isGlobal: true,
        socket: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        }
      }),
      inject: [ConfigService],
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
