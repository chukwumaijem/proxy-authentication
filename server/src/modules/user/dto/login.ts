import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { AccountUserEntity } from '../entities/account-user.entity';
import { MessageStatusDto } from '../../../common/dto';

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
export class LoginResponse extends MessageStatusDto {
  @Field({ nullable: true })
  data: UserData;
}
