import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { National } from './entities/national.entity';
import { UserRepository } from './repositories/user.repository';
import { LoginLogService } from './login-log.service';
import { LoginLogRepository } from './repositories/login-log.repository';
import { LoginLog } from './entities/login-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, National, LoginLog])],
  controllers: [UserController],
  providers: [UserService, UserRepository, LoginLogService, LoginLogRepository],
  exports: [UserService, LoginLogService],
})
export class UserModule {}
