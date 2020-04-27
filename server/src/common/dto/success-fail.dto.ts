import { ObjectType, Field, createUnionType } from '@nestjs/graphql';

import { TokenDto, UserData } from '../../modules/user/dto';
import { MessageStatusDto } from './message-status.dto';

const SuccessFailDataUnion = createUnionType({
  name: 'SuccessFailData',
  types: () => [UserData, TokenDto, MessageStatusDto],
  resolveType: value => {
    if (value.user) return UserData;
    if (value.token) return TokenDto;
    return MessageStatusDto;
  },
});

@ObjectType()
export class SuccessFailResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(() => SuccessFailDataUnion, { nullable: true })
  data: UserData | TokenDto | MessageStatusDto;
}
