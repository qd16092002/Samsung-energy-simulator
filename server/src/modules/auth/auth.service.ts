import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/configuration';

import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { JwtTokenService } from './jwt-token.service';
import { SESSION_PREFIX } from 'src/common/const/redis-prefix';
import { LoginDto } from './dto/login.dto';
import { isMatchPassword } from 'src/utils/bcrypt';
import { LoginLogService } from '../user/login-log.service';

@Injectable()
export class AuthService {
  private refreshTokenExpiration: number;
  constructor(
    private readonly userService: UserService,
    private readonly loginLogService: LoginLogService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly cacheService: RedisCacheService,
  ) {
    this.refreshTokenExpiration = this.configService.get(
      'jwtRefreshExpiration',
    );
  }

  async login(
    loginDto: LoginDto,
    ipAddress: string,
  ) {
    const user = await this.userService.findOneByUsername(loginDto.username);
    const isMatch = !!user
      ? await isMatchPassword(loginDto.password, user.password)
      : false;

    if (!isMatch) {
      throw new UnauthorizedException({
        code: 1000,
        message: 'username or password invalid',
      });
    }
    const { accessToken, refreshToken } =
      await this.jwtTokenService.genTokenPare({
        userId: user.id,
        username: user.username,
        nationalId: user.nationalId,
      });

    await this.setSessionCache({ userId: user.id, refreshToken: refreshToken });
    const { password, ...remain } = user;

    // console.log({
    //   username: user.username,
    //   nationalId: user.nationalId,
    //   ipaddress: ipAddress,
    // })
    await this.loginLogService.create({
      username: user.username,
      nationalId: user.nationalId,
      ipaddress: ipAddress,
    });

    return {
      ...remain,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(args: {
    userId: number;
    username: string;
    nationalId: number;
  }) {
    const { accessToken, refreshToken } =
      await this.jwtTokenService.genTokenPare({
        userId: args.userId,
        username: args.username,
        nationalId: args.nationalId,
      });

    await this.setSessionCache({
      userId: args.userId,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.deleteSessionCache(userId);
    return { success: true };
  }

  async setSessionCache(args: { userId: number; refreshToken: string }) {
    return this.cacheService.set(
      `${SESSION_PREFIX}-${args.userId}`,
      { refreshToken: args.refreshToken },
      this.refreshTokenExpiration * 1000,
    );
  }

  async deleteSessionCache(userId: number) {
    return this.cacheService.del(`${SESSION_PREFIX}-${userId}`);
  }

  async getSessionCache(userId: number) {
    return this.cacheService.get(`${SESSION_PREFIX}-${userId}`);
  }
}
