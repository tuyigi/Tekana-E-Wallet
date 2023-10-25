import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { ResponseDto } from '../../../common/dtos/response.dto';
import { AuthenticateDto } from '../../../common/dtos/authenticate.dto';
import { Shared } from '../../../common/helpers/shared';
import { FilterHelper } from '@app/common/helpers/filter.helper';
import {
  checkAuthorizationDto,
  checkAuthorizationResponseDto,
  CustomerDto,
  customerFilters,
  CustomerFindDto,
  customerFindFilters,
  CustomerFindResponseDto,
  CustomerResponseDto,
  OtpValidationDto,
  otpValidationRes,
} from '@app/common/types/ms_customer';
import { JwtService } from './jwt.service';
import { RedisService } from '../../../common/redis-caching/services/redis.service';
import { OtpResponseDto } from '../../../common/dtos/opt.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as process from 'process';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SmsDto } from '@app/common/dtos/sms.dto';

@Injectable()
export class CustomerService extends FilterHelper<Customer> {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectQueue(process.env.QUEUE_NAME) private readonly queue: Queue,
  ) {
    super(customerRepo);
  }

  /**
   * Service For customer registration
   * @param customerDto
   * @return ResponseDto
   */
  async customerRegistration(customerDto: CustomerDto): Promise<ResponseDto> {
    /**
     * check if customer already exist with given phone number and email
     */
    let customer: Customer = await Customer.findOneBy({
      email: customerDto.email,
      phone_number: customerDto.phoneNumber,
    });
    if (customer)
      return new ResponseDto(
        HttpStatus.CONFLICT,
        `customer already exist with ${customerDto.phoneNumber} and ${customerDto.email}`,
      );
    /**
     * Encrypt given password using helper
     */
    const password: string = Shared.encryptPassword(customerDto.password);
    /**
     * Instatiate customer object
     */
    customer = new Customer();
    customer.email = customerDto.email;
    customer.first_name = customerDto.firstName;
    customer.last_name = customerDto.lastName;
    customer.phone_number = customerDto.phoneNumber;
    customer.id_type = customerDto.idType;
    customer.id_number = customerDto.idNumber;
    customer.gender = customerDto.gender;
    customer.password = password;
    /**
     * Save new customer record
     */
    const savedCustomer = await Customer.save(customer);
    return new ResponseDto(
      HttpStatus.CREATED,
      `Customer saved successfully`,
      savedCustomer,
    );
  }

  /**
   * Service for getting customer(s) by filtering with any column
   * @param customerFilters
   * @return CustomerResponseDto
   */
  async getCustomers(
    customerFilters: customerFilters,
  ): Promise<CustomerResponseDto> {
    const filters = {
      id: customerFilters?.id,
      last_name: customerFilters?.lastName || null,
      first_name: customerFilters?.firstName || null,
    };
    const customers = await this.paginate({
      pageSize: 10,
      pageNumber: 1,
      filter: {
        ...filters,
      },
    });
    const customerDto: CustomerDto[] = [];
    customers.list.map((value) => {
      customerDto.push({
        firstName: value?.first_name,
        lastName: value?.last_name,
        email: value?.email,
        phoneNumber: value?.phone_number,
        idType: value?.id_type,
        idNumber: value?.id_number,
        gender: value?.gender,
        password: null,
      });
    });
    return { data: customerDto, status: HttpStatus.OK, message: `success` };
  }

  //
  /**
   * Service for authenticating customer
   * This is two-factor authentication, after finding customer existance.
   * Customer will be validated by OTP
   * OTP is being cached in Redis Server
   * @param authenticateDto
   * @return ResponseDto
   */
  async authenticateUser(
    authenticateDto: AuthenticateDto,
  ): Promise<ResponseDto> {
    /**
     * Check if user exist
     */
    const customer: Customer = await Customer.findOneBy({
      email: authenticateDto.email,
    });
    if (!customer) {
      return new ResponseDto(
        HttpStatus.NOT_FOUND,
        `Customer with ${authenticateDto.email} not found`,
      );
    }

    /**
     * Check if password doesn't match
     */
    const isPasswordMatch = this.jwtService.isPasswordMatch(
      authenticateDto.password,
      customer.password,
    );
    if (!isPasswordMatch)
      return new ResponseDto(HttpStatus.UNAUTHORIZED, `Unathorized`);

    /**
     * Generate OTP for two-factor authentication
     */
    const otp: string = Shared.generateOtp();

    /**
     * Cache OTP for 5 minutes expiry time
     */
    await this.redisService.setWithExpiry(
      `${process.env.REDIS_TEKANA_PREFIX}`,
      customer.phone_number,
      otp,
      parseInt(process.env.REDIS_OTP_VALIDITY_TIME),
    );

    /**
     * Add Send SMS request in the queue where it will be processed
     */
    const payload: SmsDto = {
      phoneNumber: customer.phone_number,
      message: `Dear ${customer.first_name} ${customer.last_name}, your OTP is ${otp}. valid for 5 minutes. `,
      senderID: process.env.SMSSENDERID,
    };

    await this.queue.add(payload, {
      attempts: Number(process.env.QUEUE_RETRIES),
    });

    /**
     * Return Response
     */
    return new ResponseDto(
      HttpStatus.OK,
      `we have sent you OTP SMS valid for 5 mins to your number ${customer.phone_number}`,
    );
  }

  /**
   * -- validate OTP for two-factor authentication if it is valid allow user to be authenticated and get token --
   * After validattting OTP we immediately delete it from Redis DB
   * @param otp
   * @param phoneNumber
   * @return OtpResponseDto
   */
  async validateOTP({
    otp,
    phoneNumber,
  }: OtpValidationDto): Promise<OtpResponseDto> {
    /**
     * Check OTP is not expired
     */
    const cachedOtp = await this.redisService.get(
      `${process.env.REDIS_TEKANA_PREFIX}`,
      phoneNumber,
    );
    if (!cachedOtp) return new OtpResponseDto(400, `OTP expired, try again`);
    /**
     * check if OTP matches  if not return response and delete current otp
     */
    if (cachedOtp !== otp) {
      await this.redisService.delete(
        `${process.env.REDIS_TEKANA_PREFIX}`,
        phoneNumber,
      );
      return new OtpResponseDto(400, `incorrect OTP, try again later`);
    }

    /**
     * delet and expires token after verifying
     */
    await this.redisService.delete(
      `${process.env.REDIS_TEKANA_PREFIX}`,
      phoneNumber,
    );

    /**
     * Generate Token
     */
    const customer = await Customer.findOneBy({ phone_number: phoneNumber });
    const token = this.jwtService.generateToken(customer);
    const data: otpValidationRes = {
      id: customer.id,
      lastName: customer.last_name,
      firstName: customer.first_name,
      email: customer.email,
      phoneNumber: customer.phone_number,
      idType: customer.id_type,
      idNumber: customer.id_number,
      gender: customer.gender,
    };
    return new OtpResponseDto(
      HttpStatus.OK,
      `OTP validated successfully`,
      data,
      token,
    );
  }

  /**
   * -- Function for getting one customer by ID. --
   * @param customerFindFilters
   * @return CustomerFindResponseDto
   */
  async findCustomer(
    customerFindFilters: customerFindFilters,
  ): Promise<CustomerFindResponseDto> {
    /**
     * Checks if ID is define.
     * If ID is defined, check from database.
     */
    if (customerFindFilters.id === null || undefined)
      return { status: HttpStatus.BAD_REQUEST, message: `Id is missing` };
    /**
     * check if customer exist with given ID
     */
    const customer = await Customer.findOneBy({ id: customerFindFilters.id });
    if (!customer)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `customer with ${customerFindFilters.id} not found `,
      };
    /**
     * construct the reponse
     */
    const data: CustomerFindDto = {
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phoneNumber: customer.phone_number,
      idType: customer.id_type,
      idNumber: customer.id_number,
      gender: customer.gender,
    };

    return {
      data,
      status: HttpStatus.OK,
      message: `success`,
    };
  }

  /**
   * Service for checking authorization
   * @param request
   */
  async checkAuthorization(
    request: checkAuthorizationDto,
  ): Promise<checkAuthorizationResponseDto> {
    /**
     * Get data of customer from given token
     */
    const customer: Customer = await this.jwtService.verify(request.token);
    if (!customer)
      return { isAuthorized: false, message: `unauthorized request` };
    /**
     * Verify if customer exist
     */
    const customerExist: Customer = await Customer.findOneBy({
      id: customer.id,
    });
    if (!customerExist)
      return { isAuthorized: false, message: `customer not found` };

    return { isAuthorized: true, message: 'authorized', id: customerExist.id };
  }
}
