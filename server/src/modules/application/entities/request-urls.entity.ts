import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';
import { ApplicationEntity } from './application.entity';

@ObjectType()
@Entity()
export class RequestURLEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsUrl()
  url: string;

  @Field(() => ID)
  @ManyToOne(
    () => ApplicationEntity,
    application => application.requestUrls,
    {
      cascade: ['insert'],
    },
  )
  application: ApplicationEntity;
}
