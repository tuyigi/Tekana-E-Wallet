import { Transaction } from '../../modules/transaction/entities/transaction.entity';
export class TransactionProccessDto {
  isProccessed: boolean;
  message: string;
  transaction?: Transaction;
}
