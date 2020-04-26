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
import * as bcrypt from 'bcryptjs';
import { IsEmail, MinLength } from 'class-validator';

@ObjectType()
@Entity()
export abstract class UserEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: true })
  first_name: string;

  @Field()
  @Column({ nullable: true })
  last_name: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @MinLength(10)
  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  created_date: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Date)
  @Column({ nullable: true })
  last_login_date: Date;

  @Field()
  @Column({ default: false })
  email_verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }
}
