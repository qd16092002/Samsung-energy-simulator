import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './config/typeorm.config';
import { CheckHealthModule } from './modules/check-health/check-health.module';
import { ConfigModule } from '@nestjs/config';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnergyDataModule } from './modules/energy-data/energy-data.module';
import { ModelsModule } from './modules/models/models.module';
import configuration from './config/configuration';
import { ScoreModule } from './modules/score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ? ['.env.development'] : ['.env'],
      load: [configuration],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmOptions),
    CheckHealthModule,
    RedisCacheModule,
    UserModule,
    AuthModule,
    EnergyDataModule,
    ModelsModule,
    ScoreModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
