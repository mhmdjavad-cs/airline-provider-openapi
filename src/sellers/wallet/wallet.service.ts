import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../../db';
import {
  wallets,
  walletTransactions,
} from '../../db/schema';

@Injectable()
export class WalletService {
  async getWallet(ticketSellerId: number) {
    const result = await db
      .select()
      .from(wallets)
      .where(
        eq(
          wallets.ticketSellerId,
          ticketSellerId,
        ),
      );

    if (!result[0]) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    return result[0];
  }

  async getTransactions(ticketSellerId: number) {
    const walletResult = await db
      .select()
      .from(wallets)
      .where(
        eq(
          wallets.ticketSellerId,
          ticketSellerId,
        ),
      );

    const wallet = walletResult[0];

    if (!wallet) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    return db
      .select()
      .from(walletTransactions)
      .where(
        eq(
          walletTransactions.walletId,
          wallet.id,
        ),
      );
  }
}
