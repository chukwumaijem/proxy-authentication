import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ApplicationEntity } from '../entities/application.entity';
import { ApplicationService } from '../services/application.service';
import { LoggedInGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { ICurrentUser } from '../../../common/interfaces';
import {
  CreateApplicationInput,
  ApplicationResponseDto,
  UpdateApplicationInput,
  RefreshKeyInput,
  UpdateApplicationKey,
  AddRequestURLInput,
  UpdateRequestURLInput,
} from '../dto';
import { MessageStatusDto } from '../../../common/dto';

@Resolver(() => ApplicationEntity)
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Mutation(() => ApplicationResponseDto)
  @UseGuards(LoggedInGuard)
  async createApplication(@Args('data') data: CreateApplicationInput, @CurrentUser() currentUser: ICurrentUser) {
    return this.applicationService.createApplication(data, currentUser);
  }

  @Query(() => [ApplicationEntity], { name: 'applications', nullable: 'items' })
  @UseGuards(LoggedInGuard)
  async getApplications() {
    return this.applicationService.getApplications();
  }

  @Query(() => ApplicationResponseDto, { name: 'application' })
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

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async removeApplication(@Args('applicationId') applicationId: string) {
    return this.applicationService.removeApplication(applicationId);
  }

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async addRequestURL(@Args('data') data: AddRequestURLInput) {
    return this.applicationService.addRequestURL(data);
  }

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async removeRequestURL(@Args('requestUrlId') requestUrlId: string) {
    return this.applicationService.removeRequestURL(requestUrlId);
  }

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async updateRequestURL(@Args('requestUrlData') requestUrlData: UpdateRequestURLInput) {
    return this.applicationService.updateRequestURL(requestUrlData);
  }
}
