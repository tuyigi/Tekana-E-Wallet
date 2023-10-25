import { otpValidationRes } from '@app/common/types/ms_customer';

export class OtpResponseDto {
  status: number;
  message: string;
  token: string;
  data?: otpValidationRes | undefined;

  constructor(
    status: number,
    message: string,
    data?: otpValidationRes | undefined,
    token?: string,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.token = token;
  }
}
