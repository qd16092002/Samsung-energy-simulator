import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginLog } from '../entities/login-log.entity';

@Injectable()
export class LoginLogRepository extends RepositoryBase<LoginLog> {
  constructor(@InjectRepository(LoginLog) repository: Repository<LoginLog>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
