import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_TipoEntidades')
export class TipoEntidades {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    Entidades: string;

    @Field()
    @Column()
    Descripcion: string;
}
