import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from '../entities/result-data.entity';

@Injectable()
export class ResultRepository extends RepositoryBase<ResultData> {
  constructor(@InjectRepository(ResultData) repository: Repository<ResultData>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
