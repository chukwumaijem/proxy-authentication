import { createUnionType } from '@nestjs/graphql';

import { ChangePasswordResponse, LoginResponse } from 'src/modules/user/dto';
import { MessageStatusDto } from './message-status.dto';

export const SuccessFailResponseUnion = createUnionType({
  name: 'SuccessFailResponse',
  types: () => [MessageStatusDto, ChangePasswordResponse, LoginResponse] as any,
  resolveType: value => {
    if (value && value.data) {
      if (value.data.user) return ChangePasswordResponse;
      if (value.data.token) return LoginResponse;
    }
    return MessageStatusDto;
  },
});
