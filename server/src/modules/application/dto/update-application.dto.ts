import { InputType, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MessageStatusDto } from 'src/common/dto';

@InputType()
export class UpdateApplicationInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  isActive: boolean;
}

@ObjectType()
class KeyData {
  @Field()
  key: string;
}

@ObjectType()
export class UpdateApplicationKey extends MessageStatusDto {
  @Field(() => KeyData)
  data: KeyData;
}

enum KeyTypes {
  SECRET_KEY,
  PUBLIC_KEY,
}

registerEnumType(KeyTypes, {
  name: 'KeyTypes',
});

@InputType()
export class RefreshKeyInput {
  @Field(() => ID)
  applicationId: string;

  @Field(() => KeyTypes)
  key: KeyTypes;
}
