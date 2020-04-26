import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { AccountUserEntity } from '../entities/account-user.entity';

@InputType()
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class UserData {
  @Field(() => AccountUserEntity)
  user: AccountUserEntity;

  @Field()
  token: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  data: UserData;
}
