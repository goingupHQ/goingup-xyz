import { z } from 'zod';
import { procedure, router } from '../trpc';
import {
  deleteEmailLoginCodeRecord,
  getAddressByAccessToken,
  getEmailLoginCodeRecord,
  saveAuthToken,
} from '@/utils/database/auth';
import { TRPCError } from '@trpc/server';
import { createCustodialAccount, getCustodialAccountByEmail } from '@/utils/database/account';
import { ethers } from 'ethers';
import { decrypt, encrypt } from '@/utils/kms';
import crypto from 'crypto';
import { getDb } from '@/utils/database';
import { AccessToken } from '@/types/auth';
import { validateSignature } from '@/utils/web3-signature';

export const authRouter = router({
  signInWithSignature: procedure
    .input(
      z.object({
        signature: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { signature, address } = input;
      const message = `I am signing this message to prove that I own the address ${address}. This message will be used to sign in to app.goingup.xyz and receive an authentication token cookie.`;

      const validSignature = validateSignature(address, message, signature);
      if (!validSignature) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid signature' });

      // set access token and cookie
      const accessToken = crypto.randomBytes(64).toString('hex');

      // expires 100 days from now
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 100);
      const maxAge = expires.getTime() - Date.now();

      // save access token to database
      await saveAuthToken(accessToken, address);

      const { res } = ctx;
      // set access token as secure cookie
      res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}; Max-Age=${maxAge}`,
      ]);
    }),
  verifyEmailCode: procedure
    .input(
      z.object({
        email: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, code } = input;

      // check if code exists
      const record = await getEmailLoginCodeRecord(email, code);
      if (!record) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid code' });
      }

      // check if code is expired
      if (record.expiresAt < new Date()) {
        deleteEmailLoginCodeRecord(email, code);
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Code has expired' });
      }

      // check if custodial account exists
      let existing = await getCustodialAccountByEmail(email);

      if (!existing) {
        // generate an ethers wallet
        const wallet = ethers.Wallet.createRandom();

        // encrypt wallet private key with google cloud kms
        const encryptedPrivateKey = await encrypt(wallet.privateKey);

        // save account to database
        await createCustodialAccount(email, wallet.address, encryptedPrivateKey.cipherText);
        existing = await getCustodialAccountByEmail(email);
      }

      if (!existing) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get custodial account' });
      }

      // delete code from database
      deleteEmailLoginCodeRecord(email, code);

      // set access token and cookie
      const accessToken = crypto.randomBytes(64).toString('hex');

      // expires 100 days from now
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 100);
      const maxAge = expires.getTime() - Date.now();

      // save access token to database
      await saveAuthToken(accessToken, existing.address!);

      const { res } = ctx;
      // set access token as secure cookie
      res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}; Max-Age=${maxAge}`,
      ]);

      const account = await getCustodialAccountByEmail(email);
      if (!account) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get custodial account' });
      }
      account.encryptedPrivateKey = 'redacted'; // don't return the encrypted private key
      return account;
    }),
  checkAccessTokenValidity: procedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { req } = ctx;
      const { address } = input;

      if (!req.cookies.access_token) return false;

      const accessTokenAddress = await getAddressByAccessToken(req.cookies.access_token);
      if (!accessTokenAddress) return false;

      return address === accessTokenAddress;
    }),
  signOut: procedure.mutation(async ({ ctx }) => {
    const { req, res } = ctx;
    if (!req.cookies.access_token) return false;

    const accessToken = req.cookies.access_token;
    const expires = new Date(0);
    const maxAge = expires.getTime() - Date.now();

    // delete access token from database
    const db = await getDb();
    await db.collection('access-tokens').deleteOne({ accessToken });

    // set access token as secure cookie
    res.setHeader('Set-Cookie', [
      `access_token=; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}; Max-Age=${maxAge}`,
    ]);

    return true;
  }),
});

export const getAccountByAccessToken = async (accessToken: string) => {
  const db = await getDb();
  const tokenRecord = await db.collection<AccessToken>('access-tokens').findOne({ accessToken });
  if (!tokenRecord) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid access token' });

  const account = await db.collection('accounts').findOne({ address: tokenRecord.address });
  if (!account) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get account' });

  return account;
};
