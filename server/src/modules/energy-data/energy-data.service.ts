import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllEnergyDto, GetOneDto } from './dto/get-all.dto';
import { EnergyDataRepository } from './repositories/energy-data.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class EnergyDataService {
  constructor(private readonly energyDataRepository: EnergyDataRepository) {}
  async findAll(args: GetAllEnergyDto) {
    const qb = this.energyDataRepository
      .createQueryBuilder('ed')
      .where('ed.isActive = :isActive', { isActive: true });
    if (args.field && args.search) {
      qb.where(`ed.${args.field} LIKE '%${args.search}%`);
    }

    if (args.sort && args.sortBy) {
      qb.orderBy(
        `ed.${args.sortBy}`,
        args.sort.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    return this.energyDataRepository.parsePaginate(qb, {
      take: args.limit,
      skip: args.skip,
    });
  }

  async findOne(query: GetOneDto & { nationalId: number }) {
    return this.energyDataRepository
      .findOneOrFail({
        where: {
          year: query.year,
          capacity: query.capacity,
          energyStar: query.energyStar,
          isInverter: query.isInverter ?? IsNull(),
          nationalId: query.nationalId,
          isActive: true,
        },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getAllCapacity(
    nationalId: number,
    query: { year: number; energyStar: string },
  ) {
    let qb = this.energyDataRepository
      .createQueryBuilder('ed')
      .select('DISTINCT ed.capacity', 'capacity')
      .where('ed.nationalId = :nationalId', { nationalId })
      .andWhere('ed.isActive = :isActive', { isActive: true });

    if (query.year) {
      qb = qb.andWhere('ed.year = :year', { year: +query.year });
    }

    if (query.energyStar) {
      qb = qb.andWhere('ed.energyStar = :energyStar', {
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
    query: { year: number; capacity: string },
  ) {
    let qb = await this.energyDataRepository
      .createQueryBuilder('ed')
      .select('DISTINCT ed.energyStar', 'energyStar')
      .where('ed.nationalId = :nationalId', { nationalId })
      .andWhere('ed.isActive = :isActive', { isActive: true });

    if (query.year) {
      qb = qb.andWhere('ed.year = :year', { year: +query.year });
    }

    if (query.capacity) {
      qb = qb.andWhere('ed.capacity = :capacity', { capacity: query.capacity });
    }

    qb.orderBy('ed.energyStar', 'ASC');

    const data = await qb.getRawMany();
    return data.map((item) => item.energyStar);
  }

  async getAllYear(
    nationalId: number,
    query: { energyStar: string; capacity: string },
  ) {
    let qb = this.energyDataRepository
      .createQueryBuilder('ed')
      .select('DISTINCT ed.year', 'year')
      .where('ed.nationalId = :nationalId', { nationalId })
      .andWhere('ed.isActive = :isActive', { isActive: true });

    if (query.energyStar) {
      qb = qb.andWhere('ed.energyStar = :energyStar', {
        energyStar: query.energyStar,
      });
    }

    if (query.capacity) {
      qb = qb.andWhere('ed.capacity = :capacity', { capacity: query.capacity });
    }

    qb.orderBy('ed.year', 'ASC');

    const data = await qb.getRawMany();
    return data.map((item) => item.year);
  }
}
