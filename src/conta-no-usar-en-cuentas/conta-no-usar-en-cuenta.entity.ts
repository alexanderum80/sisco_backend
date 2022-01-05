import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_NoUsarenCta')
export class ContaNoUsarEnCuentaEntity {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field({ nullable: true })
    @Column({ length: 3, nullable: true })
    Codigo: string;

    @Field({ nullable: true })
    @Column({ length: 8, nullable: true })
    Cta: string;

    @Field({ nullable: true })
    @Column({ length: 8, nullable: true })
    SubCta: string;

    @Field({ nullable: true })
    @Column({ length: 10, nullable: true })
    Crit1: string;

    @Field({ nullable: true })
    @Column({ length: 10, nullable: true })
    Crit2: string;

    @Field({ nullable: true })
    @Column({ length: 10, nullable: true })
    Crit3: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    TextoInicio: string;
}
