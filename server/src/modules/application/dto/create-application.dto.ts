import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateApplicationInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: 'items' })
  requestUrls: string[];
}
