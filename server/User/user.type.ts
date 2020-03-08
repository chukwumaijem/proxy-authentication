import { InputType, Field } from "type-graphql";
import { Min, Max, MaxLength } from "class-validator";

@InputType()
export class UserInputType {
  @Field()
  @MaxLength(15)
  first_name: string;

  @Field()
  @MaxLength(15)
  last_name: string;

  @Field()
  @Min(18)
  @Max(100)
  age: number;
}
