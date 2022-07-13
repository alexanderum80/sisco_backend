import { ConexionesQueryResponse } from './conexiones.model';
import { Connection } from 'typeorm';
import { cloneDeep } from 'lodash';
import { Injectable } from '@nestjs/common';
import { dataBasesQuery, DEFAULT_CONNECTION_STRING } from './../conexiones/conexiones.model';

@Injectable()
export class ConexionesService {
    constructor() {}

    async getDataBases(ip: string, ususario: string, password: string): Promise<ConexionesQueryResponse> {
        try {
            let connectionString = cloneDeep(DEFAULT_CONNECTION_STRING);
            Object.defineProperties(connectionString, {
                host: {
                    value: ip
                },
                username: {
                    value: ususario
                },
                password: {
                    value: password
                },
                database: {
                    value: 'master'
                }
            });

            const connection: Connection = await new Connection(connectionString).connect();
            return new Promise<ConexionesQueryResponse>(resolve => {
                connection.query(dataBasesQuery).then(result => {
                    resolve({ success: true, data: result });
                }).catch(err => {
                    resolve({ success: false, error: err.message ? err.message : err });
                });
            });
        } catch (err: any) {
            return { success: false, error: err.message ? err.message : err };
        }
    }
}
