import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DatabaseEnv } from './evn/database-env';

export class DatabaseConfigService {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: DatabaseEnv.DB_TYPE,
      host: DatabaseEnv.DB_HOST,
      port: DatabaseEnv.DB_PORT,
      username: DatabaseEnv.DB_USERNAME,
      password: DatabaseEnv.DB_PASSWORD,
      database: DatabaseEnv.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
    };
  }
}
