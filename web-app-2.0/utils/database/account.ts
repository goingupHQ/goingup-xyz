import { Account } from '@/types/account';
import { getDb } from '../database';

export const getAccount = async (address: string): Promise<Account | null> => {
  const db = await getDb();
  const goingUpAccount = await db.collection<Account>('accounts').findOne({ address });
  return goingUpAccount;
};
