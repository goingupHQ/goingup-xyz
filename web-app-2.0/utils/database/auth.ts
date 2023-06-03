import { AccessToken, EmailLoginCode } from '@/types/auth';
import { getDb } from '../database';

export const getEmailLoginCodeRecord = async (email: string, code: string) => {
  const db = await getDb();
  const record = await db.collection<EmailLoginCode>('email-login-codes').findOne({ email, code });
  return record;
};

export const deleteEmailLoginCodeRecord = async (email: string, code: string) => {
  const db = await getDb();
  await db.collection<EmailLoginCode>('email-login-codes').deleteOne({ email, code });
};

export const saveAuthToken = async (token: string, address: string) => {
  const db = await getDb();
  const record = {
    token,
    address,
    createdAt: new Date(),
  };
  await db.collection<AccessToken>('access-tokens').insertOne(record);
};

export const getAddressByAccessToken = async (accessToken: string): Promise<string | null> => {
  const db = await getDb();
  const record = await db.collection<AccessToken>('access-tokens').findOne({ token: accessToken });
  return record?.address ?? null;
};
