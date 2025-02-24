import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/common/base/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnergyData } from '../entities/energy-data.entity';

@Injectable()
export class EnergyDataRepository extends RepositoryBase<EnergyData> {
  constructor(
    @InjectRepository(EnergyData) repository: Repository<EnergyData>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
