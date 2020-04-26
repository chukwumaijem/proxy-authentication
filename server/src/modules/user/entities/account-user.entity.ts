import {
  Entity,
  Column,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../../common/entities/user.entity';

@ObjectType()
@Entity()
export class AccountUserEntity extends UserEntity {
  @Field(() => Date)
  @Column({ nullable: true })
  invite_accepted_on: Date;

  @Field()
  @Column({ default: false })
  invite_accepted: boolean;

  @Field()
  @Column({ default: false })
  default_password_changed: boolean;
}
