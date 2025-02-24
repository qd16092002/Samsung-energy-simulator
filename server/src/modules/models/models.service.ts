import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelRepository } from './repositories/model.repository';
import { GetAllModelDto } from './dto/get-all.query';
import { CalculateEnergySavingDto } from './dto/calculate-energy-saving.dto';
import { EnergyDataService } from '../energy-data/energy-data.service';
import { EModelGrade } from './enum/model.enum';
import { ResultRepository } from './repositories/result.repository';

@Injectable()
export class ModelsService {
  constructor(
    private readonly modelRepository: ModelRepository,
    private readonly resultRepo: ResultRepository,
    private readonly energyDataService: EnergyDataService,
  ) {}
  async findAll(args: GetAllModelDto) {
    const qb = this.modelRepository.createQueryBuilder('m');

    return this.modelRepository.parsePaginate(qb, {
      take: args.limit,
      skip: args.skip,
    });
  }

  async findOne(modelCode: string) {
    return this.modelRepository
      .findOneOrFail({
        where: { modelCode: modelCode },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async calculateEnergySaving(
    args: CalculateEnergySavingDto,
    nationalId: number,
  ) {
    const [energyData, model] = await Promise.all([
      this.energyDataService.findOne({
        ...args.existingAirConditioner,
        nationalId: nationalId,
      }),
      this.findOne(args.modelCode),
    ]);

    let energyConsumption;
    if (energyData.eer) {
      energyConsumption = (1 - energyData.eer / model.eer) * 100;
    } else if (energyData.iseer) {
      energyConsumption = (1 - energyData.iseer / model.iseer) * 100;
    } else if (energyData.cspf) {
      energyConsumption = (1 - energyData.cspf / model.cspf) * 100;
    }

    const existCost =
      (args.annualAirConditioner * args.monthlyBill * args.portionOfAC) / 100;
    const saveCost = (existCost * energyConsumption) / 100;
    const paybackPeriod = (
      (args.newModelPrice ?? model.price) / saveCost
    ).toFixed(1);

    const resultData = this.resultRepo.create({
      yearEx: energyData.year,
      capacityEx: energyData.capacity,
      energyStarEx: energyData.energyStar,
      isInverterEx: energyData.isInverter,
      eerEx: energyData.eer,
      cspfEx: energyData.cspf,
      iseerEx: energyData.iseer,
      capacityDs: model.capacity,
      modelCodeDs: model.modelCode,
      eerDs: model.eer,
      cspfDs: model.cspf,
      iseerDs: model.iseer,
      priceDs: model.price,
      gradeDs: model.grade,
      energyStarDs: model.energyStar,
      nationalId,
      savedPercentage: energyConsumption,
      costEx: existCost,
      costDs: existCost - saveCost,
      savedMoney: saveCost,
    });

    const result = await this.resultRepo.save(resultData);

    return {
      resultId: result.id,
      energyConsumption,
      paybackPeriod,
      existCost,
      saveCost,
      newCost: existCost - saveCost,
    };
  }

  async getALlModelCode(
    query: { grade: EModelGrade; energyStar: string; capacity: string },
    nationalId: number,
  ) {
    let qb = this.modelRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.modelCode', 'modelCode')
      .where('m.nationalId = :nationalId', { nationalId });

    if (query.grade) {
      qb.andWhere('m.grade = :grade', { grade: query.grade });
    }

    if (query.energyStar) {
      qb = qb.andWhere('m.energyStar = :energyStar', {
        energyStar: query.energyStar,
      });
    }

    if (query.capacity) {
      qb = qb.andWhere('m.capacity = :capacity', { capacity: query.capacity });
    }

    const data = await qb.getRawMany();
    return data.map((item) => item.modelCode);
  }

  async getAllCapacity(
    nationalId: number,
    query: { grade: EModelGrade; energyStar: string },
  ) {
    let qb = this.modelRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.capacity', 'capacity')
      .where('m.nationalId = :nationalId', { nationalId });

    if (query.grade) {
      qb = qb.andWhere('m.grade = :grade', { grade: query.grade });
    }

    if (query.energyStar) {
      qb = qb.andWhere('m.energyStar = :energyStar', {
        energyStar: query.energyStar,
      });
    }

    const data = await qb.getRawMany();

    return data
      .map((item) => item.capacity)
      .sort((a, b) => Number(a) - Number(b));
  }

  async getAllStarClass(
    nationalId: number,
    query: { grade: EModelGrade; capacity: string },
  ) {
    let qb = await this.modelRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.energyStar', 'energyStar')
      .where('m.nationalId = :nationalId', { nationalId });

    if (query.grade) {
      qb = qb.andWhere('m.grade = :grade', { grade: query.grade });
    }

    if (query.capacity) {
      qb = qb.andWhere('m.capacity = :capacity', { capacity: query.capacity });
    }

    qb.orderBy('m.energyStar', 'ASC');

    const data = await qb.getRawMany();
    return data.map((item) => item.energyStar);
  }

  async getAllGrade(
    nationalId: number,
    query: { energyStar: string; capacity: string },
  ) {
    let qb = await this.modelRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.grade', 'grade')
      .where('m.nationalId = :nationalId', { nationalId });

    if (query.energyStar) {
      qb = qb.andWhere('m.energyStar = :energyStar', {
        energyStar: query.energyStar,
      });
    }

    if (query.capacity) {
      qb = qb.andWhere('m.capacity = :capacity', { capacity: query.capacity });
    }

    qb.orderBy('m.energyStar', 'ASC');

    const data = await qb.getRawMany();
    return data.map((item) => item.grade);
  }
}
