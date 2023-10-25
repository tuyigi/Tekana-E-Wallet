/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Any } from "../../../../google/protobuf/any";

export const protobufPackage = "ms_customer";

export enum IdType {
  NID = 0,
  PASSPORT = 1,
  UNRECOGNIZED = -1,
}

export enum GenderType {
  FEMALe = 0,
  MALE = 1,
  UNRECOGNIZED = -1,
}

export interface checkAuthorizationDto {
  token: string;
}

export interface checkAuthorizationResponseDto {
  isAuthorized: boolean;
  id?: number | undefined;
  message?: string | undefined;
}

export interface customerFindFilters {
  id?: number | undefined;
  phoneNumber?: string | undefined;
  idNumber?: string | undefined;
  email?: string | undefined;
}

export interface customerFilters {
  id?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

export interface CustomerResponseDto {
  status: number;
  message: string;
  data: CustomerDto[];
}

export interface CustomerFindResponseDto {
  status: number;
  message: string;
  data?: CustomerFindDto | undefined;
}

export interface CustomerFindDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: IdType;
  idNumber: string;
  gender: GenderType;
}

export interface OtpValidationDto {
  otp: string;
  phoneNumber: string;
}

export interface OtpResponseDto {
  status: number;
  message: string;
  token?: string | undefined;
  data?: otpValidationRes | undefined;
}

export interface otpValidationRes {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  idType: IdType;
  idNumber: string;
  gender: GenderType;
}

export interface CustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: IdType;
  idNumber: string;
  password: string;
  gender: GenderType;
}

export interface ResponseDto {
  status: number;
  message: string;
  data?: Any | undefined;
}

export interface AuthenticateDto {
  email: string;
  password: string;
}

export const MS_CUSTOMER_PACKAGE_NAME = "ms_customer";

export interface CustomerServiceClient {
  customerRegistration(request: CustomerDto): Observable<ResponseDto>;

  authenticateUser(request: AuthenticateDto): Observable<ResponseDto>;

  validateOtp(request: OtpValidationDto): Observable<OtpResponseDto>;

  getCustomer(request: customerFilters): Observable<CustomerResponseDto>;

  findOne(request: customerFindFilters): Observable<CustomerFindResponseDto>;

  checkAuthorization(request: checkAuthorizationDto): Observable<checkAuthorizationResponseDto>;
}

export interface CustomerServiceController {
  customerRegistration(request: CustomerDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto;

  authenticateUser(request: AuthenticateDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto;

  validateOtp(request: OtpValidationDto): Promise<OtpResponseDto> | Observable<OtpResponseDto> | OtpResponseDto;

  getCustomer(
    request: customerFilters,
  ): Promise<CustomerResponseDto> | Observable<CustomerResponseDto> | CustomerResponseDto;

  findOne(
    request: customerFindFilters,
  ): Promise<CustomerFindResponseDto> | Observable<CustomerFindResponseDto> | CustomerFindResponseDto;

  checkAuthorization(
    request: checkAuthorizationDto,
  ): Promise<checkAuthorizationResponseDto> | Observable<checkAuthorizationResponseDto> | checkAuthorizationResponseDto;
}

export function CustomerServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "customerRegistration",
      "authenticateUser",
      "validateOtp",
      "getCustomer",
      "findOne",
      "checkAuthorization",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CustomerService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CustomerService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CUSTOMER_SERVICE_NAME = "CustomerService";
