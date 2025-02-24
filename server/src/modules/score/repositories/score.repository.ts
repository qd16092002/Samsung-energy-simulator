import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';

@Injectable()
export class ScoreRepository extends RepositoryBase<Score> {
  constructor(@InjectRepository(Score) repository: Repository<Score>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
