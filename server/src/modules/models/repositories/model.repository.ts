import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from '../entities/model.entity';

@Injectable()
export class ModelRepository extends RepositoryBase<Model> {
  constructor(@InjectRepository(Model) repository: Repository<Model>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
