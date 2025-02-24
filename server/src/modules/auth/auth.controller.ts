import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guards/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenInfoParam } from './decorators/refresh-token-info-param.decorator';
import { LoginDto } from './dto/login.dto';
import { IUserInfoParam, UserInfo } from './decorators/user-info.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { getIpFromRequest } from 'src/utils/get-ip';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({
    status: 401,
    description: 'invalid username or password',
  })
  async login(
    @Body() body: LoginDto,
    @Req() request: Request
  ) {
    return this.authService.login(
      body,
      getIpFromRequest(request),
    );
  }

  @ApiBearerAuth('auth')
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@RefreshTokenInfoParam() refreshInfo: IUserInfoParam) {
    return this.authService.refreshToken({
      userId: refreshInfo.id,
      username: refreshInfo.username,
      nationalId: refreshInfo.nationalId,
    });
  }

  @ApiBearerAuth('auth')
  @Post('logout')
  async logout(@UserInfo() refreshInfo: IUserInfoParam) {
    return this.authService.logout(refreshInfo.id);
  }
}
