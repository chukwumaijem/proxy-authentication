import { Resolver, Query } from '@nestjs/graphql';

import { AccountUserEntity } from '../entities/account-user.entity';
import { AccountUserService } from '../services/account-user.service';

@Resolver()
export class AccountUserResolver {
  constructor(private acountService: AccountUserService) {}

  @Query(() => [AccountUserEntity])
  async acountUsers() {
    return this.acountService.getAllUsers();
  }
}
