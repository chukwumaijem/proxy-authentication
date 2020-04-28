import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class AddRequestURLInput {
  @Field(() => ID)
  applicationId: string;

  @Field()
  url: string;
}

@InputType()
export class UpdateRequestURLInput {
  @Field(() => ID)
  requestUrlId: string;

  @Field()
  url: string;
}

