import { z } from 'zod';
import { router, procedure } from '../trpc';
import { createOrgCodes, get, getAll, isOwner } from '@/utils/database/organization';
import admins from '@/utils/admins.json';
import { validateSignature } from '@/utils/web3-signature';
import { TRPCError } from '@trpc/server';
import { ethers } from 'ethers';
import toHex from 'to-hex';
import { hexToDec } from 'hex2dec';
import { GoingUpUtilityTokens__factory } from '@/typechain';
import { getNextTokenId } from '@/utils/utility-tokens';
import { parseUnits } from 'ethers/lib/utils.js';

export const organizationsRouter = router({
  getAll: procedure.query(async () => {
    const orgs = await getAll();
    return orgs;
  }),
  get: procedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
    return get(input.code);
  }),
  createRewardToken: procedure
    .input(
      z.object({
        code: z.string(),
        address: z.string(),
        message: z.string(),
        signature: z.string(),
        tokenName: z.string(),
        tokenDescription: z.string(),
        tokenMetadataURI: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await checkOrgOwner(input);

      const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);
      const wallet = new ethers.Wallet(process.env.GOINGUP_BACKEND_PK, provider);

      const utilityTokensContract = GoingUpUtilityTokens__factory.connect(
        process.env.NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN,
        wallet
      );

      const tokenId = await getNextTokenId();

      const { code, tokenName, tokenDescription, tokenMetadataURI } = input;
      const catHex = toHex(code, { prefix: true });
      const catDec = Number(hexToDec(catHex));
      const tx = await utilityTokensContract.setTokenSettings(
        tokenId,
        tokenName,
        tokenMetadataURI,
        catDec,
        0,
        parseUnits('0.0125', 18)
      );

      const receipt = await tx.wait();

      // save tokenid to organization record
    }),
  createOrgCodes: procedure
    .input(
      z.object({
        signature: z.string(),
        message: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const isSignatureValid = await validateSignature(input.address, input.message, input.signature);
      if (!isSignatureValid) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid signature' });
      }

      if (!admins.includes(input.address)) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not admin' });
      }

      await createOrgCodes();
    }),
});

async function checkOrgOwner(input: { code: string; message: string; address: string; signature: string }) {
  const isSignatureValid = await validateSignature(input.address, input.message, input.signature);
  if (!isSignatureValid) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid signature' });
  }

  if (!isOwner(input.code, input.address)) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not org owner' });
  }
}
