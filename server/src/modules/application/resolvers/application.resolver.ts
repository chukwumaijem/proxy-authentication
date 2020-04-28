import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ApplicationEntity } from '../entities/application.entity';
import { ApplicationService } from '../services/application.service';
import { LoggedInGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { ICurrentUser } from '../../../common/interfaces';
import { CreateApplicationInput, ApplicationResponseDto, UpdateApplicationInput, RefreshKeyInput, UpdateApplicationKey } from '../dto';
import { MessageStatusDto } from '../../../common/dto';

@Resolver(() => ApplicationEntity)
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Mutation(() => ApplicationResponseDto)
  @UseGuards(LoggedInGuard)
  async createApplication(@Args('data') data: CreateApplicationInput, @CurrentUser() currentUser: ICurrentUser) {
    return this.applicationService.createApplication(data, currentUser);
  }

  @Query(() => [ApplicationEntity], { name: 'applications' })
  @UseGuards(LoggedInGuard)
  async getApplications() {
    return this.applicationService.getApplications();
  }

  @Query(() => ApplicationEntity, { name: 'application' })
  @UseGuards(LoggedInGuard)
  async getApplication(@Args('applicationId') applicationId: string) {
    return this.applicationService.getApplication(applicationId);
  }

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async updateApplication(@Args('data') data: UpdateApplicationInput) {
    return this.applicationService.updateApplication(data);
  }

  @Mutation(() => UpdateApplicationKey)
  @UseGuards(LoggedInGuard)
  refreshKey(@Args('refreshKeyInput') refreshKeyInput: RefreshKeyInput) {
    return this.applicationService.refreshSecretOrPrivateKey(refreshKeyInput);
  }
}
