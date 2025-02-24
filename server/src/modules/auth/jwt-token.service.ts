import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentVariables } from 'src/config/configuration';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async generateToken(args: {
    userId: number;
    username: string;
    nationalId: number;
  }): Promise<string> {
    const payload = {
      sub: args.userId,
      username: args.username,
      nationalId: args.nationalId,
    };

    return this.jwtService.sign(payload);
  }

  async genRefreshToken(args: {
    userId: number;
    username: string;
    nationalId: number;
  }): Promise<string> {
    const payload = {
      sub: args.userId,
      username: args.username,
      nationalId: args.nationalId,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwtRefreshSecret'),
      expiresIn: this.configService.get('jwtRefreshExpiration'),
    });
  }

  async genTokenPare(args: {
    userId: number;
    username: string;
    nationalId: number;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(args),
      this.genRefreshToken(args),
    ]);

    return { accessToken, refreshToken };
  }
}
