import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getDb } from '@/utils/database';
import { EmailMintRequest } from '@/types/email-mint';
import { createCustodialAccount, getAccountByEmail } from '@/utils/database/account';
import { ethers } from 'ethers';
import { encrypt } from '@/utils/kms';
import { ObjectId } from 'mongodb';

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
  discardMintRequest: procedure.input(z.object({ confirmationId: z.string() })).mutation(async ({ input }) => {
    const { confirmationId } = input;

    const db = await getDb();
    const collection = db.collection<EmailMintRequest>('email-mint-requests');
    await collection.deleteMany({ confirmationId });
  }),
  confirmMintRequests: procedure.input(
    z.object({
      mintRequests: z.array(
        z.object({
          id: z.string(),
          qtyToMint: z.number(),
          tokenIdToMint: z.number(),
          finalMintMessage: z.string(),
        })
      ),
    })
  ).mutation(async ({ input }) => {
    const { mintRequests } = input;

    const db = await getDb();

    const collection = db.collection<EmailMintRequest>('email-mint-requests');
    for (const mintRequest of mintRequests) {
      const result = await collection.updateOne(
        { _id: ObjectId.createFromHexString(mintRequest.id) },
        {
          $set: {
            confirmedBySenderOn: new Date(),
            qtyToMint: mintRequest.qtyToMint,
            tokenIdToMint: mintRequest.tokenIdToMint,
            finalMintMessage: mintRequest.finalMintMessage,
          },
        }
      );
    }
  }),
});

type MintRequestWithWallet = EmailMintRequest & { walletAddress: string };
