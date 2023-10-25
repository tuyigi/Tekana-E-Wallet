import { Controller } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import {
  AuthenticateDto,
  CustomerServiceController,
  CustomerDto,
  ResponseDto,
  CustomerServiceControllerMethods,
  OtpValidationDto,
  customerFilters,
  CustomerResponseDto,
  customerFindFilters,
  CustomerFindResponseDto,
  checkAuthorizationDto,
  checkAuthorizationResponseDto,
} from '@app/common/types/ms_customer';
import { Observable } from 'rxjs';
import { OtpResponseDto } from '../../../common/dtos/opt.response.dto';
import { MessagePattern } from '@nestjs/microservices';
import { request } from 'express';

@Controller()
@CustomerServiceControllerMethods()
export class CustomerController implements CustomerServiceController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * GRPC method for Customer authentication
   * This is twp factor authentication, It will first send OTP and cache it in REdis server
   * Customer will be fully authenticated after OTP validation
   * @param request
   */
  @MessagePattern('authenticateUser')
  authenticateUser(
    request: AuthenticateDto,
  ): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto {
    return this.customerService.authenticateUser(request);
  }

  /**
   * GRPC method for Customer registration
   * @param request
   */
  @MessagePattern('customerRegistration')
  customerRegistration(
    request: CustomerDto,
  ): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto {
    return this.customerService.customerRegistration(request);
  }

  /**
   * GRPC method for two-factor authentication process / validate OTP ( valid only for 5 mins)
   * @param request
   */
  @MessagePattern('validateOtp')
  validateOtp(
    request: OtpValidationDto,
  ): Promise<OtpResponseDto> | Observable<OtpResponseDto> | OtpResponseDto {
    return this.customerService.validateOTP(request);
  }

  /**
   * GRPC method for getting customers
   * @param request
   */
  @MessagePattern('getCustomer')
  getCustomer(
    request: customerFilters,
  ):
    | Promise<CustomerResponseDto>
    | Observable<CustomerResponseDto>
    | CustomerResponseDto {
    return this.customerService.getCustomers(request);
  }

  /**
   * GRPC method for Getting one customer by filter with any of column with unique constrant
   * @param request
   */
  @MessagePattern('findOne')
  findOne(
    request: customerFindFilters,
  ):
    | Promise<CustomerFindResponseDto>
    | Observable<CustomerFindResponseDto>
    | CustomerFindResponseDto {
    return this.customerService.findCustomer(request);
  }

  /**
   * GRPC method for checking the authorization of customer internally
   * @param request
   */
  @MessagePattern('checkAuthorization')
  checkAuthorization(
    request: checkAuthorizationDto,
  ):
    | Promise<checkAuthorizationResponseDto>
    | Observable<checkAuthorizationResponseDto>
    | checkAuthorizationResponseDto {
    return this.customerService.checkAuthorization(request);
  }
}
