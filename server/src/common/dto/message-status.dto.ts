import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MessageStatusDto {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
