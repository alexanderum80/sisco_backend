import { ConexionesService } from './conexiones.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ConexionesQueryResponse } from './conexiones.model';

@Resolver()
export class ConexionesResolver {
  constructor(private _conexionesService: ConexionesService) {}

  @Query(() => ConexionesQueryResponse)
  getDataBases(@Args('ip') ip: string, @Args('ususario') usuario: string, @Args('password') password: string): Promise<ConexionesQueryResponse> {
    return this._conexionesService.getDataBases(ip, usuario, password);
  }
}
