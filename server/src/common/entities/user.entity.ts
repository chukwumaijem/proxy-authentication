import {
  Entity,
  Column,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { genSaltSync, hashSync } from 'bcryptjs';
import { IsEmail, MinLength } from 'class-validator';

@ObjectType()
@Entity()
export abstract class UserEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ nullable: true })
  lastName: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @MinLength(10)
  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date)
  @Column({ nullable: true })
  lastLoginDate: Date;

  @Field()
  @Column({ default: false })
  emailVerified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password) {
      const salt = genSaltSync(10);
      this.password = hashSync(this.password, salt);
    }
  }
}
