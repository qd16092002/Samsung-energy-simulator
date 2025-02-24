import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessLogService } from './access-log.service';
import { getIpFromRequest } from 'src/utils/get-ip';
import { Public } from '../auth/guards/public.decorator';

@ApiTags('check-health')
@Controller('check-health')
export class CheckHealthController {
  constructor(
    private readonly accessLogService: AccessLogService
  ) {}

  @Get()
  findAll() {
    return;
  }

  @Public()
  @Post()
  async log(
    @Req() request: Request
  ) {
    return this.accessLogService.create(
      { ipaddress: getIpFromRequest(request) },
    );
  }

}
