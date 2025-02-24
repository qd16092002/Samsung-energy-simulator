import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { ModelRepository } from './repositories/model.repository';
import { EnergyDataModule } from '../energy-data/energy-data.module';
import { ResultRepository } from './repositories/result.repository';
import { ResultData } from './entities/result-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model, ResultData]), EnergyDataModule],
  controllers: [ModelsController],
  providers: [ModelsService, ModelRepository, ResultRepository],
  exports: [ModelsService],
})
export class ModelsModule {}
