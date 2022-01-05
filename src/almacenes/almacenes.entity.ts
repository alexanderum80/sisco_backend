import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Almacenes {
    @Field()
    @PrimaryColumn()
    IdGerenciaIdAlmacen: number;

    @Field()
    @Column()
    IdUnidad: number;

    @Field({ nullable: true })
    @Column()
    Almacen?: string;

    @Field({ nullable: true })
    @Column()
    IdPiso?: number;

    @Field({ nullable: true })
    @Column()
    EContable?: string;

    @Field({ nullable: true })
    @Column()
    EContableMN?: string;

    @Field()
    @Column()
    Abierto: boolean;

    @Field()
    @Column()
    Exhibicion: boolean;

    @Field()
    @Column()
    Interno: boolean;

    @Field()
    @Column()
    Merma: boolean;

    @Field()
    @Column()
    Gastronomia: boolean;

    @Field()
    @Column()
    Insumo: boolean;

    @Field()
    @Column()
    Inversiones: boolean;

    @Field()
    @Column()
    Boutique: boolean;

    @Field()
    @Column()
    MermaOrigen: boolean;

    @Field()
    @Column()
    Consignacion: boolean;

    @Field()
    @Column()
    Emergente: boolean;

    @Field()
    @Column()
    ReservaDiv: boolean;

    @Field()
    @Column()
    ReservaNac: boolean;

    @Field()
    @Column()
    DespachoDiv: boolean;

    @Field()
    @Column()
    OrigenReplica: boolean;

    @Field()
    @Column()
    DestinoReplica: boolean;

    @Field()
    @Column()
    CapacidadFrio: number;

    @Field()
    @Column()
    Ociosos: boolean;

    @Field()
    @Column()
    LentoMov: boolean;

    @Field()
    @Column()
    MercanciaVenta: boolean;

    @Field()
    @PrimaryColumn()
    Distribuidor: boolean;
}