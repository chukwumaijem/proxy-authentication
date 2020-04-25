import {
  Entity,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../../shared/entities/user.entity';

@ObjectType()
@Entity()
export class AccountUserEntity extends UserEntity {
  @Field(() => Date)
  @Column({ nullable: true })
  invite_accepted_on: Date;

  @Field()
  @Column({ default: false })
  invite_accepted: boolean;
}
