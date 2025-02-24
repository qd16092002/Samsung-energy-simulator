import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SESSION_PREFIX } from 'src/common/const/redis-prefix';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly redisCache: RedisCacheService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtRefreshSecret'),
    });
  }

  async validate(payload: any) {
    const session = await this.redisCache.get(
      `${SESSION_PREFIX}-${payload.sub}`,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    return {
      attributes: {
        id: payload.sub,
        username: payload.username,
        nationalId: payload.nationalId,
      },
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
