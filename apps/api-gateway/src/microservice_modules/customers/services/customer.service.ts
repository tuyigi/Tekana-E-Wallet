import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthenticateDto,
  CustomerDto,
  CustomerServiceClient,
  CUSTOMER_SERVICE_NAME,
  OtpValidationDto,
  customerFilters,
  customerFindFilters,
  checkAuthorizationDto,
  checkAuthorizationResponseDto,
} from '@app/common/types/ms_customer';
import { MS_CUSTOMER } from '../../../common/constants/constants';

@Injectable()
export class CustomerService {
  /**
   * Customer service client
   * @private
   */
  private customerService: CustomerServiceClient;
  constructor(@Inject(MS_CUSTOMER) private client: ClientGrpc) {
    this.customerService = this.client.getService<CustomerServiceClient>(
      CUSTOMER_SERVICE_NAME,
    );
  }

  /**
   * Register customer
   * @param customerDto
   */
  registerCustomer(customerDto: CustomerDto) {
    return this.customerService.customerRegistration(customerDto);
  }

  /**
   * Authenticate Customer
   * @param authenticateDto
   */
  authenticateCustomer(authenticateDto: AuthenticateDto) {
    return this.customerService.authenticateUser(authenticateDto);
  }

  /**
   * Validate OTP for two-factor authentication
   * @param otpValidationDto
   */
  validateOtp(otpValidationDto: OtpValidationDto) {
    return this.customerService.validateOtp(otpValidationDto);
  }

  /**
   * Get Customers
   * @param customerFilters
   */
  getCustomers(customerFilters: customerFilters) {
    return this.customerService.getCustomer(customerFilters);
  }

  /**
   * Find Customer
   * @param customerFindFilters
   */
  findCustomer(customerFindFilters: customerFindFilters) {
    return this.customerService.findOne(customerFindFilters);
  }

  /**
   * Check authorization
   * @param checkAuthorizationDto
   */
  checkAuthorization(checkAuthorizationDto: checkAuthorizationDto) {
    return this.customerService.checkAuthorization(checkAuthorizationDto);
  }
}
