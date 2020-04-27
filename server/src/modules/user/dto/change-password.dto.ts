import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}

@ObjectType()
export class TokenDto {
  @Field()
  token: string;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  data: TokenDto;
}
