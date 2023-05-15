import { Account } from '@/types/account';
import { getDb } from '../database';

export const getAccount = async (address: string): Promise<Account | null> => {
  const db = await getDb();
  const goingUpAccount = await db.collection<Account>('accounts').findOne({ address });
  return goingUpAccount;
};

export const findAccount = async (query: string): Promise<Account[]> => {
  const db = await getDb();
  const nameRegex = new RegExp(`${query}`, 'i');
  const accounts = await db
    .collection<Account>('accounts')
    .find({ name: nameRegex, chain: 'Ethereum', mock: { $exists: false } })
    .limit(10)
    .toArray();

  return accounts;
};
