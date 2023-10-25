import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Wallet } from '../../modules/wallet/entities/wallet.entity';
import { generateAccountNumber } from '../helpers/utilities.helper';

/**
 * Event subscribers handle for wallet
 * Mainly used for generating wallet account number after wallet creation
 * this helps us to generate unique well formatted account number
 * format of wallet :: 001-00000010
 * 001 => wallet type ID
 * 00000010 => Wallet primary key which is rejustified
 */
@EventSubscriber()
export class WalletSubscriber implements EntitySubscriberInterface<Wallet> {
  /**
   * Subscriber for generating account number
   * After insertion of new wallet
   */
  async afterInsert(event: InsertEvent<Wallet>): Promise<any> {
    /**
     * Get formatted generated account number
     */
    const account_number: string = generateAccountNumber(
      event.entity.id,
      event.entity.wallet_type_id.id,
    );
    const wallet: Wallet = await Wallet.findOneBy({ id: event.entity.id });
    wallet.account_number = account_number;
    await Wallet.save(wallet);
  }
}
