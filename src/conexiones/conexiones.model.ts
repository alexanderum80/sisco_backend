import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Field, ObjectType } from '@nestjs/graphql';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

@ObjectType()
export class Conexiones {
  @Field()
  name: string | undefined;
}

@ObjectType()
export class ConexionesQueryResponse {
  @Field()
  success: boolean | undefined;

  @Field(() => [Conexiones], { nullable: true })
  data?: Conexiones[];

  @Field(() => String, { nullable: true })
  error?: string;
}

export const DEFAULT_SQL_CONNECTION_STRING: SqlServerConnectionOptions = {
  type: 'mssql',
  host: '',
  username: '',
  password: '',
  database: '',
  connectionTimeout: 60000,
  requestTimeout: 60000,
  synchronize: false,
  options: {
    enableArithAbort: true,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1',
    },
    encrypt: true,
  },
};

export const DEFAULT_POSTGRES_CONNECTION_STRING: PostgresConnectionOptions = {
  type: 'postgres',
  host: '',
  username: 'r4_sisco',
  password: 'aqntjstE.2008',
  database: '',
  connectTimeoutMS: 60000,
  maxQueryExecutionTime: 180000,
  synchronize: false,
};

export const dataBasesQuery = `SELECT name FROM sysdatabases ORDER BY name`;
