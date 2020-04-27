import { SuccessFailResponse } from '../dto/success-fail.dto';

export const responseHandler = (success: boolean, message: string, data = null): SuccessFailResponse => ({
  success,
  message,
  data,
});
