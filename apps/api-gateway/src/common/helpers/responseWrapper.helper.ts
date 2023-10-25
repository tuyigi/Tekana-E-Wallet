import { Response } from 'express';
import { ResponseDto } from '@app/common/types/ms_customer';
import { Observable } from 'rxjs';

/**
 * this function is a wrapper for formatting the response and provide given http status from service
 * @param response
 * @param responseDto
 */
export const responseWrapperHelper = async (
  response: Response,
  responseDto: Observable<any>,
) => {
  let _responseDto: ResponseDto = null;
  await responseDto.forEach((value) => (_responseDto = value));
  return response.status(_responseDto?.status).send(_responseDto);
};
