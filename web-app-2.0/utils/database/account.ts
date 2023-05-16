import { Account } from '@/types/account';
import { getDb } from '../database';

export const getAccount = async (address: string): Promise<Account | null> => {
  const db = await getDb();
  const goingUpAccount = await db.collection<Account>('accounts').findOne({ address });
  return goingUpAccount;
};

export const getAccountByEmail = async (email: string): Promise<Account | null> => {
  const db = await getDb();
  const acccount = await db.collection<Account>('accounts').findOne({ email });
  return acccount;
};

export const getCustodialAccountByEmail = async (email: string): Promise<Account | null> => {
  const db = await getDb();
  const account = await db.collection<Account>('accounts').findOne({ email, isCustodial: true });
  return account;
};

export const createCustodialAccount = async (email: string, address: string, encryptedPrivateKey): Promise<void> => {
  if (await getCustodialAccountByEmail(email)) {
    throw new Error('Account already exists');
  }

  const db = await getDb();

  const account: Account = {
    name: '',
    email,
    address,
    isCustodial: true,
    chain: 'Ethereum',
    reputationScore: 50,
    encryptedPrivateKey,
    createdAt: new Date(),
  };

  await db.collection<Account>('accounts').insertOne(account);
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
