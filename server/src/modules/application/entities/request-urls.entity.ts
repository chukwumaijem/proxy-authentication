import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { ApplicationEntity } from './application.entity';

@ObjectType()
@Entity()
export class RequestURLEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  url: string;

  @Field(() => ID)
  @ManyToOne(
    () => ApplicationEntity,
    application => application.requestUrls,
  )
  application: ApplicationEntity;
}
