import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { RequestURLEntity } from './request-urls.entity';

@ObjectType()
@Entity()
export class ApplicationEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  publicKey: string;

  @Field()
  @Column()
  secretKey: string;

  @Field(() => [RequestURLEntity], { nullable: 'items' })
  @OneToMany(
    () => RequestURLEntity,
    requestUrl => requestUrl.application,
    {
      cascade: ['insert', 'update'],
    },
  )
  requestUrls: RequestURLEntity[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  createdBy: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;
}
