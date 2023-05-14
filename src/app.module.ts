import { DATASOURCE } from './datasource';
import { ContaGrupoCuentaModule } from './conta-grupo-cuenta/conta-grupo-cuenta.module';
import { ContaCategoriaCuentaModule } from './conta-categoria-cuenta/conta-categoria-cuenta.module';
import { ContaClaseCuentaModule } from './conta-clase-cuenta/conta-clase-cuenta.module';
import { ActfijosClasificadorSubgruposModule } from './actfijos-clasificador-subgrupos/actfijos-clasificador-subgrupos.module';
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
import { ConciliaExtContabilidadModule } from './concilia-externa-contabilidad/concilia-externa-contabilidad.module';
import { TipoEntidadesModule } from './tipo-entidades/tipo-entidades.module';
import { EpigrafesModule } from './epigrafes/epigrafes.module';
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
import 'dotenv/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConciliaUhModule } from './concilia-uh/concilia-uh.module';
import { ContaEstadisticaModule } from './conta-estadistica/conta-estadistica.module';
import { ContaInformeCtasCobrarPagarModule } from './conta-informe-ctas-cobrar-pagar/conta-informe-ctas-cobrar-pagar.module';
import { ConciliaInternaContaModule } from './concilia-interna-conta/concilia-interna-conta.module';
import { ConciliaExternaDwhModule } from './concilia-externa-dwh/concilia-externa-dwh.module';
import { ConciliaExternaEntreUnidadesModule } from './concilia-externa-entre-unidades/concilia-externa-entre-unidades.module';
import { ConciliaExternaChatsModule } from './concilia-externa-chats/concilia-externa-chats.module';
import { ConciliaExternaDatosConciliacionModule } from './concilia-externa-datos-conciliacion/concilia-externa-datos-conciliacion.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: (req: any) => ({ headers: req.headers }),
      formatError: err => {
        err.message = err.message
          .replace('Unexpected error value: ', '')
          .replace(/"/g, '')
          .replace(/Error:/g, '');
        return err;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DATASOURCE.HOST_NAME,
      username: DATASOURCE.USER_NAME,
      password: DATASOURCE.PASSWORD,
      database: DATASOURCE.DATABASE_NAME,
      connectTimeoutMS: parseInt(DATASOURCE.CONNECTION_TIMEOUT),
      maxQueryExecutionTime: parseInt(DATASOURCE.REQUEST_TIMEOUT),
      entities: ['**/*.entity.js'],
      synchronize: false,
    }),

    SharedModule,
    UsuariosModule,
    DivisionesModule,
    ContaConexionesModule,
    UnidadesModule,
    DwhConexionesModule,
    CargosModule,
    ConciliaDwhModule,
    ConciliaContaModule,
    EmpleadosModule,
    SupervisoresModule,
    ParteAtrasoModule,
    ConexionesModule,
    ConciliaInternaDwhModule,
    SubdivisionesModule,
    ClasificadorCuentaModule,
    ConciliaExtContabilidadModule,
    TipoEntidadesModule,
    EpigrafesModule,
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
    ConciliaAftModule,
    ConciliaUhModule,
    ContaEstadisticaModule,
    ConciliaInternaContaModule,
    ContaClaseCuentaModule,
    ContaCategoriaCuentaModule,
    ContaGrupoCuentaModule,
    ConciliaExternaDwhModule,
    ConciliaExternaEntreUnidadesModule,
    ConciliaExternaChatsModule,
    ConciliaExternaDatosConciliacionModule,
    ActfijosClasificadorSubgruposModule,
    LogsModule,
    ContaInformeCtasCobrarPagarModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailsService],
})
export class AppModule {}
