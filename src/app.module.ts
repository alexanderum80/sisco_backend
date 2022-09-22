import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionesModule } from './divisiones/divisiones.module';
import { ContaConexionesModule } from './conta-conexiones/conta-conexiones.module';
import { UnidadesModule } from './unidades/unidades.module';
import { DwhConexionesModule } from './dwh-conexiones/dwh-conexiones.module';
import { CargosModule } from './cargos/cargos.module';
import { ConciliaDwhModule } from './concilia-dwh/concilia-dwh.module';
import { AlmacenesModule } from './almacenes/almacenes.module';
import { EmailsService } from './shared/services/emails/emails.service';
import { ConciliaContaModule } from './concilia-conta/concilia-conta.module';
import { SharedModule } from './shared/shared.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { SupervisoresModule } from './supervisores/supervisores.module';
import { ParteAtrasoModule } from './parte-atraso/parte-atraso.module';
import { ConexionesModule } from './conexiones/conexiones.module';
import { ConciliaInternaDwhModule } from './concilia-interna-dwh/concilia-interna-dwh.module';
import { SubdivisionesModule } from './subdivisiones/subdivisiones.module';
import { ClasificadorCuentaModule } from './clasificador-cuenta/clasificador-cuenta.module';
import { ConciliaNacContabilidadModule } from './concilia-nac-contabilidad/concilia-nac-contabilidad.module';
import { TipoEntidadesModule } from './tipo-entidades/tipo-entidades.module';
import { EpigrafesModule } from './epigrafes/epigrafes.module';
import { CuentaEntidadModule } from './cuenta-entidad/cuenta-entidad.module';
import { ElementosGastosModule } from './elementos-gastos/elementos-gastos.module';
import { ClasificadorEntidadesModule } from './clasificador-entidades/clasificador-entidades.module';
import { ContaExpresionesModule } from './conta-expresiones/conta-expresiones.module';
import { ContaTipovalorExpresionesModule } from './conta-tipovalor-expresiones/conta-tipovalor-expresiones.module';
import { ContaComprobarExpresionesModule } from './conta-comprobar-expresiones/conta-comprobar-expresiones.module';
import { ContaOperadoresModule } from './conta-operadores/conta-operadores.module';
import { ContaNoUsarEnCuentasModule } from './conta-no-usar-en-cuentas/conta-no-usar-en-cuentas.module';
import { TipoUsuariosModule } from './tipo-usuarios/tipo-usuarios.module';
import { ContaComprobarValoresModule } from './conta-comprobar-valores/conta-comprobar-valores.module';
import { CajaConfiguracionModule } from './caja-configuracion/caja-configuracion.module';
import { ConciliaAftModule } from './concilia-aft/concilia-aft.module';
import { ActfijosClasificadorCnmbModule } from './actfijos-clasificador-cnmb/actfijos-clasificador-cnmb.module';
import 'dotenv/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConciliaUhModule } from './concilia-uh/concilia-uh.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: (req: any) => ({ headers: req.headers }),
      formatError: (err: any) => {
        return err;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      username: 'sa',
      password: 'sqladmin*123',
      database: 'SISCO_Web',
      connectionTimeout: 60000,
      requestTimeout: 0,
      entities: ['**/*.entity.js'],
      synchronize: false,
      options: {
        appName: 'SISCO',
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1',
        },
      },
    }),
    SharedModule,
    UsuariosModule,
    DivisionesModule,
    ContaConexionesModule,
    UnidadesModule,
    DwhConexionesModule,
    CargosModule,
    ConciliaDwhModule,
    AlmacenesModule,
    ConciliaContaModule,
    EmpleadosModule,
    SupervisoresModule,
    ParteAtrasoModule,
    ConexionesModule,
    ConciliaInternaDwhModule,
    SubdivisionesModule,
    ClasificadorCuentaModule,
    ConciliaNacContabilidadModule,
    TipoEntidadesModule,
    EpigrafesModule,
    CuentaEntidadModule,
    ElementosGastosModule,
    ClasificadorEntidadesModule,
    ContaExpresionesModule,
    ContaTipovalorExpresionesModule,
    ContaComprobarExpresionesModule,
    ContaOperadoresModule,
    ContaNoUsarEnCuentasModule,
    TipoUsuariosModule,
    ContaComprobarValoresModule,
    CajaConfiguracionModule,
    ActfijosClasificadorCnmbModule,
    ConciliaAftModule,
    ConciliaUhModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailsService],
})
export class AppModule {}
