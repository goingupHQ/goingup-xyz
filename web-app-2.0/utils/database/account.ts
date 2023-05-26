import { Account } from '@/types/account';
import { getDb } from '../database';
import { Filter } from 'mongodb';

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

export const createCustodialAccount = async (
  email: string,
  address: string,
  encryptedPrivateKey: string
): Promise<void> => {
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

export const getPotentialCollaborators = async (
  count: number,
  onlyProfilesWithPhotos: boolean,
  userAccount: Account | null
): Promise<Account[]> => {
  const db = await getDb();
  const query: Filter<Account> = { mock: { $exists: false } };
  if (onlyProfilesWithPhotos) {
    query.profilePhoto = { $exists: true };
  }
  if (userAccount) {
    query.address = { $ne: userAccount.address };

    if (userAccount.idealCollab) {
      query.idealCollab = { $in: userAccount.idealCollab };
    }
  }

  const queryResults = await db
    .collection<Account>('accounts')
    .aggregate<Account>([{ $match: query }, { $sample: { size: Math.min(count, 40) } }])
    .toArray();

  return queryResults;
};

export const searchForProfiles = async (nameQuery: string): Promise<Account[]> => {
  console.log('searchForProfiles', nameQuery);
  const start = performance.now();
  const db = await getDb();
  const accounts = await db
    .collection<Account>('accounts')
    .find({
      mock: { $exists: false },
      profilePhoto: { $exists: true },
      $text: {
        $search: nameQuery,
        $caseSensitive: false,
      },
    })
    .limit(12)
    .toArray();

  const end = performance.now();
  console.log(`searchForProfiles took ${end - start} milliseconds`);
  return accounts;
};
