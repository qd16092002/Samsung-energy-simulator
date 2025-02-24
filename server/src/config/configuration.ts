export interface IMysqlConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  runMigrations: boolean;
}

export enum EMode {
  dev = 'DEV',
  prod = 'PROD',
}

export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface IS3Config {
  accessKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
}

export interface EnvironmentVariables {
  port: number;
  mode: EMode;
  mysql: IMysqlConfig;
  redis: IRedisConfig;
  jwtSecret: string;
  jwtTokenExpiration: number;
  jwtRefreshExpiration: number;
  jwtRefreshSecret: string;
  s3: IS3Config;
}
export default () => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret) {
    throw new Error('Jwt secret is not set in env');
  }

  if (!jwtRefreshSecret) {
    throw new Error('Jwt refresh secret is not set in env');
  }
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    mode: process.env.MODE,
    mysql: {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: process.env.MYSQL_SYNC === 'true',
      runMigrations: process.env.RUN_MIGRATIONS === 'true',
    },
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD,
    },
    jwtSecret,
    jwtRefreshSecret,
    jwtTokenExpiration: parseInt(process.env.JWT_TOKEN_EXPIRY, 10),
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRY, 10),
    s3: {
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucketName: process.env.S3_BUCKET_NAME,
    },
  };
};
