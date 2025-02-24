import { Module } from '@nestjs/common';
import { EnergyDataService } from './energy-data.service';
import { EnergyDataController } from './energy-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyData } from './entities/energy-data.entity';
import { EnergyDataRepository } from './repositories/energy-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyData])],
  controllers: [EnergyDataController],
  providers: [EnergyDataService, EnergyDataRepository],
  exports: [EnergyDataService],
})
export class EnergyDataModule {}
