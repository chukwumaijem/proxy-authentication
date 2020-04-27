import { SuccessFailResponseUnion } from '../dto';

export const responseHandler = (success: boolean, message: string, data: any = null) => {
  const response: typeof SuccessFailResponseUnion = { success, message, data };

  return response;
};
