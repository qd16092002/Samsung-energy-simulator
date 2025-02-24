import { Controller, Get, Param, Query } from '@nestjs/common';
import { EnergyDataService } from './energy-data.service';
import { GetAllEnergyDto, GetOneDto } from './dto/get-all.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IUserInfoParam,
  UserInfo,
} from '../auth/decorators/user-info.decorator';

@ApiBearerAuth('auth')
@ApiTags('energy-data')
@Controller('energy-data')
export class EnergyDataController {
  constructor(private readonly energyDataService: EnergyDataService) {}

  @Get()
  findAll(@Query() query: GetAllEnergyDto) {
    return this.energyDataService.findAll({
      ...query,
      skip: query.skip,
    });
  }

  @ApiQuery({ type: 'number', name: 'year', required: false })
  @ApiQuery({ type: 'string', name: 'energyStar', required: false })
  @Get('/all-capacity')
  getAllCapacity(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { year: number; energyStar: string },
  ) {
    return this.energyDataService.getAllCapacity(userInfo.nationalId, query);
  }

  @ApiQuery({ type: 'number', name: 'year', required: false })
  @ApiQuery({ type: 'string', name: 'capacity', required: false })
  @Get('/all-star-class')
  getAllStarClass(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { year: number; capacity: string },
  ) {
    return this.energyDataService.getAllStarClass(userInfo.nationalId, query);
  }

  @ApiQuery({ type: 'number', name: 'energyStar', required: false })
  @ApiQuery({ type: 'string', name: 'capacity', required: false })
  @Get('/all-year')
  getAllYear(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { energyStar: string; capacity: string },
  ) {
    return this.energyDataService.getAllYear(userInfo.nationalId, query);
  }

  // @Get('/get-eer')
  // findOne(@Query() query: GetOneDto, @UserInfo() userInfo: IUserInfoParam) {
  //   return this.energyDataService.findOne({
  //     ...query,
  //     nationalId: userInfo.nationalId,
  //   });
  // }
}
