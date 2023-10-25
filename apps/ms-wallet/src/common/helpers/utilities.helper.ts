import { Wallet } from '../../modules/wallet/entities/wallet.entity';
import { enumWalletOperation } from '@app/common/types/ms_wallet';

/**
 * Function for formatting number filling remaing part to 0
 * @param str
 * @param width
 * @param fillchar
 */

const rjust = (str: string, width: number, fillchar = ' '): string => {
  if (str.length >= width) {
    return str;
  }
  const padding = fillchar.repeat(width - str.length);
  return padding + str;
};

/**
 * function for generating formated account number
 * format ('walletType - walletCurrentNumber')
 * this format will prevent us to have duplicate account number
 * @param wallet_id
 * @param wallet_type_id
 */

export const generateAccountNumber = (
  wallet_id: number,
  wallet_type_id: number,
): string => {
  const no_wallet = `${wallet_id}`;
  const wallet_no = `${wallet_type_id}`;
  const number_format = `${rjust(wallet_no, 8, '0')}`;
  return `${no_wallet}-${number_format}`;
};

/**
 * Process wallet operations * : Debit and Credit
 * @param wallet
 * @param amount
 * @param operationType
 */
export const walletProcessHandler = async (
  wallet: Wallet,
  amount: number,
  operationType: enumWalletOperation,
): Promise<Wallet> => {
  switch (operationType) {
    case enumWalletOperation.DEPOSIT:
      wallet.current_balance = wallet.current_balance + amount;
      await Wallet.save(wallet);
      return wallet;
    case enumWalletOperation.WITHDRAW:
      wallet.current_balance = wallet.current_balance - amount;
      return wallet;
    default:
      return wallet;
  }
};
