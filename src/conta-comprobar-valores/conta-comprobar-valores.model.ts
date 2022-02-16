import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ComprobarValoresEntity } from './conta-comprobar-valores.entity';

@ObjectType()
export class ComprobarValoresQueryResponse extends MultipleQueryResponse(ComprobarValoresEntity) {}

@ObjectType()
export class ComprobarValorQueryResponse extends SingleQueryResponse(ComprobarValoresEntity) {}

@InputType()
export class ComprobarValoresInput {
    @Field()
    Id?: number;
  
    @Field()
    IdCentro: number;
  
    @Field()
    IdExpresion: number;
  
    @Field()
    IdOperador: string;
  
    @Field()
    Valor: number;
      
    @Field()
    IdDivision?: number;
}
