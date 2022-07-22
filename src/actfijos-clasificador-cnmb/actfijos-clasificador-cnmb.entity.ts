import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';

@Index('PK_ActFijos_ClasificadorCNMB', ['CNMB'], { unique: true })
@Entity('ActFijos_ClasificadorCNMB', { schema: 'dbo' })
@ObjectType()
export class ActFijosClasificadorCnmbEntity {
    @Field()
    @Column('nvarchar', { primary: true, name: 'CNMB', length: 10 })
    CNMB: string;

    @Field()
    @Column('nvarchar', { name: 'DCNMB', length: 40 })
    DCNMB: string;

    @Field(() => Float)
    @Column('float', { name: 'TREPO', precision: 53 })
    TREPO: number;
}
