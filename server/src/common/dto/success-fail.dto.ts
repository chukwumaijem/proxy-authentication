import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SuccessFailResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
