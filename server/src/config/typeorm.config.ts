import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EnvironmentVariables, IMysqlConfig } from './configuration';
import { National } from 'src/modules/user/entities/national.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { EnergyData } from 'src/modules/energy-data/entities/energy-data.entity';
import { Model } from 'src/modules/models/entities/model.entity';
import { LoginLog } from 'src/modules/user/entities/login-log.entity';
import { AccessLog } from 'src/modules/check-health/entities/access-log.entity';
import { ResultData } from 'src/modules/models/entities/result-data.entity';
import { Score } from 'src/modules/score/entities/score.entity';

export const typeOrmOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<EnvironmentVariables>) => {
    const mysqlConfig = configService.get<IMysqlConfig>('mysql');
    return {
      type: 'mysql',
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      username: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      synchronize: mysqlConfig.synchronize, // Be cautious about using synchronize in production
      logging: false,
      entities: [
        User, 
        National,
        EnergyData, 
        Model, 
        LoginLog, 
        AccessLog, 
        ResultData,
        Score
      ],
    };
  },
  inject: [ConfigService],
};
