import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { MessageStatusDto } from 'src/common/dto';

@InputType()
export class ChangePasswordDto {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}

@ObjectType()
class TokenDto {
  @Field()
  token: string;
}

@ObjectType()
export class ChangePasswordResponse extends MessageStatusDto {
  @Field({ nullable: true })
  data: TokenDto;
}
