import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessLog } from './entities/access-log.entity';
import { AccessLogRepository } from './repositories/access-log.repository';

@Injectable()
export class AccessLogService {
  constructor(private readonly logRepo: AccessLogRepository) {}
  
  async create(
    createAccessLogDto: {
      ipaddress: string;
    }
  ): Promise<AccessLog> {
    const { ipaddress } = createAccessLogDto;

    const loginLog = this.logRepo.create({
      ipaddress,
    });

    try {
      return await this.logRepo.save(loginLog);
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to create login log');
    }
  }
}
