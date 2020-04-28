import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ApplicationEntity } from '../entities/application.entity';
import { ApplicationService } from '../services/application.service';
import { LoggedInGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { ICurrentUser } from '../../../common/interfaces';
import { CreateApplicationInput, CreateApplicationResponse } from '../dto';

@Resolver(() => ApplicationEntity)
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Mutation(() => CreateApplicationResponse)
  @UseGuards(LoggedInGuard)
  async createApplication(@Args('data') data: CreateApplicationInput, @CurrentUser() currentUser: ICurrentUser) {
    return this.applicationService.createApplication(data, currentUser);
  }

  @Query(() => [ApplicationEntity], { name: 'applications' })
  @UseGuards(LoggedInGuard)
  async getApplications() {
    return this.applicationService.getApplications();
  }
}
