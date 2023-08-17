import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getDb } from '@/utils/database';
import { EmailMintRequest } from '@/types/email-mint';
import { createCustodialAccount, getAccountByEmail } from '@/utils/database/account';
import { ethers } from 'ethers';
import { encrypt } from '@/utils/kms';

export const emailMintRouter = router({
  getMintRequests: procedure
    .input(
      z.object({
        confirmationId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { confirmationId } = input;

      const db = await getDb();
      const collection = db.collection<EmailMintRequest>('email-mint-requests');
      const mintRequests = await collection.find({ confirmationId }).toArray();

      const mintRequestsWithWallet: MintRequestWithWallet[] = [];
      for (const mintRequest of mintRequests) {
        let account = await getAccountByEmail(mintRequest.mintTo.address);
        if (account === null) {
          const wallet = ethers.Wallet.createRandom();
          const encryptedPrivateKey = await encrypt(wallet.privateKey);
          await createCustodialAccount(mintRequest.mintTo.address, wallet.address, encryptedPrivateKey.cipherText);
          account = await getAccountByEmail(mintRequest.mintTo.address);
        }

        if (account === null) continue;

        mintRequestsWithWallet.push({
          ...mintRequest,
          walletAddress: account.address!,
        });
      }

      return mintRequestsWithWallet;
    }),
  discardMintRequest: procedure
    .input(z.object({ confirmationId: z.string() }))
    .mutation(async ({ input }) => {
      const { confirmationId } = input;

      const db = await getDb();
      const collection = db.collection<EmailMintRequest>('email-mint-requests');
      await collection.deleteMany({ confirmationId });
    }),
});

type MintRequestWithWallet = EmailMintRequest & { walletAddress: string };
