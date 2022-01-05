import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ClasificadorCuentaReal {
    @Field()
    @PrimaryColumn()
    Cuenta: string;

    @Field()
    @PrimaryColumn()
    SubCuenta: string;

    @Field()
    @Column({ nullable: true })
    Descripcion: string;

    @Field()
    @Column({ length: 1 })
    Naturaleza: string;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit1: string;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit2: string;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit3: string;

    @Field()
    @Column({ default: false})
    Obligacion: boolean;

    @Field()
    @PrimaryColumn()
    TipoClasificador: number;

    @Field()
    @Column()
    SeUtiliza: string;

    @Field()
    @Column()
    Terminal: boolean;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit1Consolidacion: string;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit2Consolidacion: string;

    @Field()
    @Column({ length: 10, nullable: true })
    Crit3Consolidacion: string;
}
