import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccountUserEntity } from '../entities/account-user.entity';
import { AccountUserService } from '../services/account-user.service';
import { LoginDto, LoginResponse, ChangePasswordDto, ChangePasswordResponse } from '../dto';
import { LoggedInGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { ICurrentUser } from 'src/common/interfaces';
import { MessageStatusDto } from 'src/common/dto';

@Resolver(() => AccountUserEntity)
export class AccountUserResolver {
  constructor(private accountService: AccountUserService) {}

  @Query(() => LoginResponse)
  async accountUserlogin(@Args('loginData', { type: () => LoginDto }) loginData: LoginDto) {
    return this.accountService.accountUserlogin(loginData);
  }

  @Mutation(() => ChangePasswordResponse)
  @UseGuards(LoggedInGuard)
  async changePassword(
    @Args('changePasswordData', { type: () => ChangePasswordDto })
    changePasswordData: ChangePasswordDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.accountService.changePassword(changePasswordData, currentUser);
  }

  @Mutation(() => MessageStatusDto)
  @UseGuards(LoggedInGuard)
  async addAccountUser(
    @Args('email')
    email: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.accountService.addAccountUser(email, currentUser);
  }
}
