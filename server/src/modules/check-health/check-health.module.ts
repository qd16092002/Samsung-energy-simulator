import { Module } from '@nestjs/common';
import { CheckHealthController } from './check-health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { AccessLogRepository } from './repositories/access-log.repository';
import { AccessLogService } from './access-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLog])],
  providers: [AccessLogRepository, AccessLogService],
  exports: [AccessLogService],
  controllers: [CheckHealthController],
})
export class CheckHealthModule {}
