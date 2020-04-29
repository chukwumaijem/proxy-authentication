import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationEntity } from './entities/application.entity';
import { RequestURLEntity } from './entities/request-urls.entity';
import { ApplicationResolver } from './resolvers/application.resolver';
import { ApplicationService } from './services/application.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity, RequestURLEntity])],
  providers: [ApplicationResolver, ApplicationService],
})
export class ApplicationModule {}
