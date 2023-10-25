import {
  Controller,
  Post,
  Body,
  Put,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import {
  AuthenticateDto,
  CustomerDto,
  customerFilters,
  customerFindFilters,
  OtpValidationDto,
} from '@app/common/types/ms_customer';
import { Request, Response } from 'express';
import { responseWrapperHelper } from '../../../common/helpers/responseWrapper.helper';
import { AuthGuard } from '../../../common/guards/authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Register new customer
   * @method POST
   * @param response
   * @param customerDto
   */
  @Post('/register')
  @ApiOperation({
    summary: 'This API endpoint responsible for registering new customer',
  })
  async registerCustomer(
    @Res() response: Response,
    @Body() customerDto: CustomerDto,
  ) {
    const registerCustomer = this.customerService.registerCustomer(customerDto);
    return await responseWrapperHelper(response, registerCustomer);
  }

  /**
   * Customer Authentication
   * @method POST
   * @param response
   * @param authenticateDto
   */
  @Post('/login')
  @ApiOperation({
    summary: 'Customer Authentication',
  })
  async authenticateCustomer(
    @Res() response: Response,
    @Body() authenticateDto: AuthenticateDto,
  ) {
    const authenticateCustomer =
      this.customerService.authenticateCustomer(authenticateDto);
    return await responseWrapperHelper(response, authenticateCustomer);
  }

  /**
   * Validate OTP for two factor authentication
   * OTP valid for 5 mins (Cached in Redis server)
   * @method PUT
   * @param response
   * @param otpValidationDto
   */

  @Put('/validateOtp')
  @ApiOperation({
    summary: 'Validate OTP for two-factor authentication',
  })
  async validateOtp(
    @Res() response: Response,
    @Body() otpValidationDto: OtpValidationDto,
  ) {
    const otpValidation = this.customerService.validateOtp(otpValidationDto);
    return await responseWrapperHelper(response, otpValidation);
  }

  /**
   * Get and filter Customers with fields
   * @method GET
   * @param request
   * @param response
   */

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Customers' })
  async getCustomers(@Req() request: Request, @Res() response: Response) {
    const { id, last_name, first_name } = request.query;
    const customerFilters: customerFilters = {
      id: Number(id),
      lastName: String(last_name) || null,
      firstName: String(first_name) || null,
    };
    const customers = this.customerService.getCustomers(customerFilters);
    return await responseWrapperHelper(response, customers);
  }

  /**
   * Find one customer with any field with unique constraint
   * @method GET
   * @fields id,phone_number, idNumber, email
   * @param request
   * @param response
   */

  @Get('/find')
  @UseGuards(AuthGuard)
  async findCustomer(@Req() request: Request, @Res() response: Response) {
    const { id, phone_number, id_number, email } = request.query;
    const customerFindFilters: customerFindFilters = {
      id: Number(id),
      phoneNumber: String(phone_number) || null,
      idNumber: String(id_number) || null,
      email: String(email) || null,
    };
    const customer = this.customerService.findCustomer(customerFindFilters);
    return await responseWrapperHelper(response, customer);
  }
}
