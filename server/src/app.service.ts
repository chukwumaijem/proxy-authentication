import { Injectable, OnModuleInit } from '@nestjs/common';
import { AccountUserService } from './modules/user';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly accountUserService: AccountUserService) {}

  async onModuleInit() {
    const numberOfAccountUsers = await this.accountUserService.countAccountUser();
    if (numberOfAccountUsers < 1) {
      this.accountUserService.createDefaultAccount();
    }
  }
}
