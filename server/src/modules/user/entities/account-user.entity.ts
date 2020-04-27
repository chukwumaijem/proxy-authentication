import { Entity, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../../common/entities/user.entity';

@ObjectType()
@Entity()
export class AccountUserEntity extends UserEntity {
  @Field(() => Date)
  @Column({ nullable: true })
  inviteAcceptedOn: Date;

  @Field()
  @Column({ default: false })
  inviteAccepted: boolean;

  @Field()
  @Column({ default: false })
  defaultPasswordChanged: boolean;

  @Field(() => ID)
  @Column({ nullable: false })
  invitedBy: string;
}
