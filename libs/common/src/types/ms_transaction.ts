/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Any } from "../../../../google/protobuf/any";

export const protobufPackage = "ms_transaction";

export enum Status {
  FAILED = 0,
  COMPLETED = 1,
  REVERSED = 2,
  CANCELLED = 3,
  PENDING = 4,
  UNRECOGNIZED = -1,
}

export enum ChannelType {
  WEB = 0,
  APP = 1,
  KIOSK = 2,
  USSD = 4,
  UNRECOGNIZED = -1,
}

export enum TypeStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  UNRECOGNIZED = -1,
}

export interface transactionTypeFilters {
  code: string;
  name: string;
}

export interface transactionFilterDto {
  transactionTypeId: number;
  referenceNumber?: string | undefined;
  channelType: ChannelType;
  externalReferenceNumber: string;
  debitedWalletId: number;
  creditedWalletId: number;
  debitedWalletBalance: number;
  creditedWalletBalance: number;
  status?: Status | undefined;
}

export interface transactionFilterResponseDto {
  status: number;
  message: string;
  data?: Any | undefined;
}

export interface initiateTransactionResponseDto {
  status: number;
  message: string;
  data?: initiateTransactionDto | undefined;
}

export interface initiateTransactionDto {
  transactionTypeId: number;
  referenceNumber?: string | undefined;
  channelType: ChannelType;
  externalReferenceNumber: string;
  debitedWalletId: number;
  creditedWalletId: number;
  debitedWalletBalance: number;
  creditedWalletBalance: number;
  amount: number;
  status?: Status | undefined;
  statusMessage?: string | undefined;
}

export interface createTransactionTypeDto {
  code: string;
  name: string;
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  status: TypeStatus;
}

export interface createTransactionTypeResponseDto {
  status: number;
  message: string;
}

export const MS_TRANSACTION_PACKAGE_NAME = "ms_transaction";

export interface TransactionTypeServiceClient {
  createTransactionType(request: createTransactionTypeDto): Observable<createTransactionTypeResponseDto>;

  getTransactionTypes(request: transactionTypeFilters): Observable<transactionFilterResponseDto>;
}

export interface TransactionTypeServiceController {
  createTransactionType(
    request: createTransactionTypeDto,
  ):
    | Promise<createTransactionTypeResponseDto>
    | Observable<createTransactionTypeResponseDto>
    | createTransactionTypeResponseDto;

  getTransactionTypes(
    request: transactionTypeFilters,
  ): Promise<transactionFilterResponseDto> | Observable<transactionFilterResponseDto> | transactionFilterResponseDto;
}

export function TransactionTypeServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createTransactionType", "getTransactionTypes"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TransactionTypeService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TransactionTypeService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_TYPE_SERVICE_NAME = "TransactionTypeService";

export interface TransactionServiceClient {
  initiateTransaction(request: initiateTransactionDto): Observable<initiateTransactionResponseDto>;

  getTransactions(request: transactionFilterDto): Observable<transactionFilterResponseDto>;
}

export interface TransactionServiceController {
  initiateTransaction(
    request: initiateTransactionDto,
  ):
    | Promise<initiateTransactionResponseDto>
    | Observable<initiateTransactionResponseDto>
    | initiateTransactionResponseDto;

  getTransactions(
    request: transactionFilterDto,
  ): Promise<transactionFilterResponseDto> | Observable<transactionFilterResponseDto> | transactionFilterResponseDto;
}

export function TransactionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["initiateTransaction", "getTransactions"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_SERVICE_NAME = "TransactionService";
