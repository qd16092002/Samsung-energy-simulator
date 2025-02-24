import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ModelsService } from './models.service';
import { GetAllModelDto } from './dto/get-all.query';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CalculateEnergySavingDto } from './dto/calculate-energy-saving.dto';
import {
  IUserInfoParam,
  UserInfo,
} from '../auth/decorators/user-info.decorator';
import { EModelGrade } from './enum/model.enum';

@ApiBearerAuth('auth')
@ApiTags('model')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post('calculate-energy')
  calculateEnergySaving(
    @Body() body: CalculateEnergySavingDto,
    @UserInfo() userInfo: IUserInfoParam,
  ) {
    return this.modelsService.calculateEnergySaving(body, userInfo.nationalId);
  }
  @Get()
  findAll(@Query() query: GetAllModelDto) {
    return this.modelsService.findAll({
      ...query,
      skip: query.skip,
    });
  }

  @ApiQuery({ name: 'grade', required: false, enum: EModelGrade })
  @ApiQuery({ name: 'energyStar', required: false })
  @ApiQuery({ name: 'capacity', required: false })
  @Get('/all-modelCode')
  getALlModelCode(
    @UserInfo() userInfo: IUserInfoParam,
    @Query()
    query: { grade: EModelGrade; energyStar: string; capacity: string },
  ) {
    return this.modelsService.getALlModelCode(query, userInfo.nationalId);
  }

  @ApiQuery({ name: 'grade', required: false, enum: EModelGrade })
  @ApiQuery({ type: 'string', name: 'energyStar', required: false })
  @Get('/all-capacity')
  getAllCapacity(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { grade: EModelGrade; energyStar: string },
  ) {
    return this.modelsService.getAllCapacity(userInfo.nationalId, query);
  }

  @ApiQuery({ name: 'grade', required: false, enum: EModelGrade })
  @ApiQuery({ type: 'string', name: 'capacity', required: false })
  @Get('/all-star-class')
  getAllStarClass(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { grade: EModelGrade; capacity: string },
  ) {
    return this.modelsService.getAllStarClass(userInfo.nationalId, query);
  }

  @ApiQuery({ type: 'string', name: 'energyStar', required: false })
  @ApiQuery({ type: 'string', name: 'capacity', required: false })
  @Get('/all-grade')
  getAllGrade(
    @UserInfo() userInfo: IUserInfoParam,
    @Query() query: { energyStar: string; capacity: string },
  ) {
    return this.modelsService.getAllGrade(userInfo.nationalId, query);
  }

  @Get('/:modelCode')
  findOne(@Param('modelCode') modelCode: string) {
    return this.modelsService.findOne(modelCode);
  }
}
