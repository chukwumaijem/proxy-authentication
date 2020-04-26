import { Resolver, Query, Args } from '@nestjs/graphql';

import { AccountUserEntity } from '../entities/account-user.entity';
import { AccountUserService } from '../services/account-user.service';
import { LoginDto, LoginResponse } from '../dto';
@Resolver(() => AccountUserEntity)
export class AccountUserResolver {
  constructor(private acountService: AccountUserService) {}

  @Query(() => LoginResponse)
  async accountUserlogin(
    @Args('loginData', { type: () => LoginDto }) loginData: LoginDto,
  ) {
    return this.acountService.accountUserlogin(loginData);
  }
}
