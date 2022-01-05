import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectionOptions } from 'typeorm';

@ObjectType()
export class Conexiones {
  @Field()
  name: string;
}

@ObjectType()
export class ConexionesQueryResponse {
  @Field()
  success: Boolean;

  @Field(type => [Conexiones], { nullable: true })
  data?: Conexiones[];

  @Field(type => String, { nullable: true })
  error?: String;
}

export const DEFAULT_CONNECTION_STRING: ConnectionOptions = {
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