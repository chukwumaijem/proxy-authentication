import { createUnionType } from '@nestjs/graphql';

import { ChangePasswordResponse, LoginResponse } from 'src/modules/user/dto';
import { MessageStatusDto } from './message-status.dto';
import { UpdateApplicationKey, ApplicationResponseDto } from 'src/modules/application/dto';

export const SuccessFailResponseUnion = createUnionType({
  name: 'SuccessFailResponse',
  types: () => [MessageStatusDto, ChangePasswordResponse, LoginResponse] as any,
  resolveType: value => {
    if (value?.data) {
      const { data } = value;
      if (data.user) return ChangePasswordResponse;
      if (data.token) return LoginResponse;
      if (data.application) return ApplicationResponseDto;
      if (data.key) return UpdateApplicationKey;
    }
    return MessageStatusDto;
  },
});
