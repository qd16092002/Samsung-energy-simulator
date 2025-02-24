import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginLogRepository } from './repositories/login-log.repository';
import { LoginLog } from './entities/login-log.entity';

@Injectable()
export class LoginLogService {
  constructor(private readonly logRepo: LoginLogRepository) {}
  
  async create(
    createLoginLogDto: {
      username: string;
      ipaddress: string;
      nationalId: number;
    }
  ): Promise<LoginLog> {
    const { username, ipaddress, nationalId } = createLoginLogDto;

    const loginLog = this.logRepo.create({
      username,
      ipaddress,
      nationalId,
    });

    try {
      return await this.logRepo.save(loginLog);
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to create login log');
    }
  }
}
