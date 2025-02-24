import { Body, Controller, Post, Req } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ScoreDto } from './dto/score.dto';
import { IUserInfoParam, UserInfo } from '../auth/decorators/user-info.decorator';
import { getIpFromRequest } from 'src/utils/get-ip';

@ApiBearerAuth('auth')
@Controller('score')
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}

    @Post()
    async calculateEnergySaving(
        @Body() body: ScoreDto,
        @UserInfo() userInfo: IUserInfoParam,
        @Req() request: Request,
    ) {
        return await this.scoreService.addScore(
            {
                ipaddress: getIpFromRequest(request),
                nationalId: userInfo.nationalId,
                resultId: body.resultId,
                score: body.score,
                username: userInfo.username,
            }
        );
    } 
}
