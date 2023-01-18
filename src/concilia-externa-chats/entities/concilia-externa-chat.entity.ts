import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('ConcExt_Chats')
export class ConciliaExternaChatsEntity {
  @Field()
  @PrimaryGeneratedColumn()
  IdChat: number;

  @Field()
  @Column()
  Usuario: number;

  @Field()
  @Column()
  Mensaje: string;

  @Field({ nullable: true })
  @Column()
  Fecha: Date;
}
