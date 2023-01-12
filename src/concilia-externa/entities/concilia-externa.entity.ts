import { VDifCantidadRecepcion } from './../../concilia-externa-dwh/concilia-externa-dwh.model';
import { ConciliaExternaEntreUnidadesEntity } from './../../concilia-externa-entre-unidades/entities/concilia-externa-entre-unidades.entity';
import { ActaConciliacion, ViewConciliaExtContabilidad } from './../../concilia-externa-contabilidad/concilia-externa-contabilidad.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { VConciliaExternaDWH } from 'src/concilia-externa-dwh/concilia-externa-dwh.model';

@ObjectType()
export class ConciliaExternaEntity {
  @Field(() => [VDifCantidadRecepcion])
  getRecDifCantidad: VDifCantidadRecepcion[];

  @Field(() => VConciliaExternaDWH)
  getConciliaDWH: VConciliaExternaDWH[];

  @Field(() => ViewConciliaExtContabilidad)
  getConciliaContab: ViewConciliaExtContabilidad[];

  @Field(() => ActaConciliacion)
  getActaConciliacion: ActaConciliacion[];

  @Field(() => ConciliaExternaEntreUnidadesEntity)
  createConcUnidadEmisor: ConciliaExternaEntreUnidadesEntity[];

  @Field(() => ConciliaExternaEntreUnidadesEntity)
  createConcUnidadReceptor: ConciliaExternaEntreUnidadesEntity[];
}
