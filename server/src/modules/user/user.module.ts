import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountUserService } from './services/account-user.service';
import { AccountUserEntity } from './entities/account-user.entity';
import { AccountUserResolver } from './resolvers/account-user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AccountUserEntity])],
  providers: [AccountUserResolver, AccountUserService],
  exports: [AccountUserService],
})
export class UserModule {}
