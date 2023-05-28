import { MutationResponse } from 'src/shared/models/mutation.response.model';
import { ContaEpigrafesEntity } from './epigrafes.entity';
import { EpigrafeInput } from './epigrafes.model';
import { EpigrafesService } from './epigrafes.service';
import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';

@Resolver()
export class EpigrafesResolver {
  constructor(private epigrafesSvc: EpigrafesService) {}

  @Query(() => [ContaEpigrafesEntity])
  async getAllEpigrafes(): Promise<ContaEpigrafesEntity[]> {
    return this.epigrafesSvc.getAllEpigrafes();
  }

  @Query(() => ContaEpigrafesEntity)
  async getEpigrafeById(@Args({ name: 'id', type: () => Int }) id: number): Promise<ContaEpigrafesEntity> {
    return this.epigrafesSvc.getEpigrafeById(id);
  }

  @Mutation(() => MutationResponse)
  async createEpigrafe(@Args({ name: 'epigrafeInfo', type: () => EpigrafeInput }) epigrafeInfo: EpigrafeInput): Promise<MutationResponse> {
    return this.epigrafesSvc.createEpigrafe(epigrafeInfo);
  }

  @Mutation(() => MutationResponse)
  async updateEpigrafe(@Args({ name: 'epigrafeInfo', type: () => EpigrafeInput }) epigrafeInfo: EpigrafeInput): Promise<MutationResponse> {
    return this.epigrafesSvc.updateEpigrafe(epigrafeInfo);
  }

  @Mutation(() => MutationResponse)
  async deleteEpigrafe(@Args({ name: 'IDs', type: () => [Int] }) IDs: number[]): Promise<MutationResponse> {
    return this.epigrafesSvc.deleteEpigrafe(IDs);
  }
}
