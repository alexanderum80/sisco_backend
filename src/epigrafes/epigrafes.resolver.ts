import { EpigrafesQueryResponse, EpigrafeQueryResponse, EpigrafeInput } from './epigrafes.model';
import { EpigrafesService } from './epigrafes.service';
import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';

@Resolver()
export class EpigrafesResolver {
    constructor(
        private epigrafesSvc: EpigrafesService
    ) {}

    @Query(() => EpigrafesQueryResponse)
    async getAllEpigrafes(): Promise<EpigrafesQueryResponse> {
        return this.epigrafesSvc.getAllEpigrafes();
    }

    @Query(() => EpigrafeQueryResponse)
    async getEpigrafeById(
        @Args({ name: 'id', type: () => Int }) id: number
    ): Promise<EpigrafeQueryResponse> {
        return this.epigrafesSvc.getEpigrafeById(id);
    }

    @Mutation(() => EpigrafeQueryResponse)
    async createEpigrafe(
        @Args({ name: 'epigrafeInfo', type: () => EpigrafeInput }) epigrafeInfo: EpigrafeInput
    ): Promise<EpigrafeQueryResponse> {
        return this.epigrafesSvc.createEpigrafe(epigrafeInfo);
    }

    @Mutation(() => EpigrafeQueryResponse)
    async updateEpigrafe(
        @Args({ name: 'epigrafeInfo', type: () => EpigrafeInput }) epigrafeInfo: EpigrafeInput
    ): Promise<EpigrafeQueryResponse> {
        return this.epigrafesSvc.updateEpigrafe(epigrafeInfo);
    }

    @Mutation(() => EpigrafeQueryResponse)
    async deleteEpigrafe(
        @Args({ name: 'IDs', type: () => [Int] }) IDs: number[]
    ): Promise<EpigrafeQueryResponse> {
        return this.epigrafesSvc.deleteEpigrafe(IDs);
    }

}
