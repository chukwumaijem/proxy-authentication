import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { UserModule } from './modules/user';
import envs from './config/app';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: !envs.isProduction,
      playground: !envs.isProduction,
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      ...envs.database,
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
