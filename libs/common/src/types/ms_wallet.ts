/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "ms_wallet";

export enum enumWalletOperation {
  WITHDRAW = 0,
  DEPOSIT = 1,
  UNRECOGNIZED = -1,
}

export enum WalletStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  DORMANT = 2,
  UNRECOGNIZED = -1,
}

export enum CurrencyCode {
  RWF = 0,
  USD = 1,
  UNRECOGNIZED = -1,
}

export interface walletOperationDto {
  action: enumWalletOperation;
  amount: number;
  walletId: number;
}

export interface walletFilters {
  id: number;
  accountNumber?: string | undefined;
}

export interface GetWalletsResponseDto {
  status: number;
  message: string;
  data: WalletTypeDto[];
}

export interface WalletTypeDto {
  code: string;
  name: string;
  description: string;
  maximumTransactionAmount: number;
  minimumTransactionAmount: number;
  id?: number | undefined;
}

export interface CreateWalletTypeResponseDto {
  status: number;
  message: string;
  data?: WalletTypeDto | undefined;
}

export interface CreateWalletResponseDto {
  status: number;
  message: string;
  data?: CreateWalletResponse | undefined;
}

export interface walletDto {
  customerId: number;
  walletTypeId: number;
}

export interface CreateWalletResponse {
  id: number;
  customerId: number;
  currencyCode: CurrencyCode;
  accountNumber: string;
  currentBalance: number;
  status: WalletStatus;
  walletTypeId?: number | undefined;
}

export const MS_WALLET_PACKAGE_NAME = "ms_wallet";

export interface WalletServiceClient {
  createWallet(request: walletDto): Observable<CreateWalletResponseDto>;

  findWallet(request: walletFilters): Observable<CreateWalletResponseDto>;

  processWalletOperation(request: walletOperationDto): Observable<CreateWalletResponseDto>;
}

export interface WalletServiceController {
  createWallet(
    request: walletDto,
  ): Promise<CreateWalletResponseDto> | Observable<CreateWalletResponseDto> | CreateWalletResponseDto;

  findWallet(
    request: walletFilters,
  ): Promise<CreateWalletResponseDto> | Observable<CreateWalletResponseDto> | CreateWalletResponseDto;

  processWalletOperation(
    request: walletOperationDto,
  ): Promise<CreateWalletResponseDto> | Observable<CreateWalletResponseDto> | CreateWalletResponseDto;
}

export function WalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createWallet", "findWallet", "processWalletOperation"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WALLET_SERVICE_NAME = "WalletService";

export interface WalletTypeServiceClient {
  createWalletType(request: WalletTypeDto): Observable<CreateWalletTypeResponseDto>;

  getWalletTypes(request: WalletTypeDto): Observable<GetWalletsResponseDto>;
}

export interface WalletTypeServiceController {
  createWalletType(
    request: WalletTypeDto,
  ): Promise<CreateWalletTypeResponseDto> | Observable<CreateWalletTypeResponseDto> | CreateWalletTypeResponseDto;

  getWalletTypes(
    request: WalletTypeDto,
  ): Promise<GetWalletsResponseDto> | Observable<GetWalletsResponseDto> | GetWalletsResponseDto;
}

export function WalletTypeServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createWalletType", "getWalletTypes"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WalletTypeService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WalletTypeService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WALLET_TYPE_SERVICE_NAME = "WalletTypeService";
