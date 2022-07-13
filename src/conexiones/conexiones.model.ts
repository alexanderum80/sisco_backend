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
  success: Boolean | undefined;

  @Field(() => [Conexiones], { nullable: true })
  data?: Conexiones[];

  @Field(() => String, { nullable: true })
  error?: String;
}

export const DEFAULT_CONNECTION_STRING: SqlServerConnectionOptions = {
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
        minVersion: 'TLSv1'
      },
      encrypt: true
    }
};

export const dataBasesQuery = `SELECT name FROM sysdatabases ORDER BY name`;