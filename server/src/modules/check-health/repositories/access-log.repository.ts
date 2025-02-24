import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../entities/access-log.entity';

@Injectable()
export class AccessLogRepository extends RepositoryBase<AccessLog> {
  constructor(@InjectRepository(AccessLog) repository: Repository<AccessLog>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
