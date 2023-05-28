import { z } from 'zod';
import { router, procedure } from '../trpc';
import { findAccount, getAccount, updateAccount } from '@/utils/database/account';
import { ethers } from 'ethers';
import { AddressOrAccountSearchResult } from '@/types/account';
import { getAddressByAccessToken } from '@/utils/database/auth';
import { TRPCError } from '@trpc/server';

export const accountsRouter = router({
  get: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    return getAccount(input.address);
  }),
  searchWithEns: procedure.input(z.object({ query: z.string() })).mutation(async ({ input }) => {
    const { query } = input;
    const results: AddressOrAccountSearchResult[] = [];

    const ethMainnetProvider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);
    const address = await ethMainnetProvider.resolveName(query);

    if (address) results.push({ address, name: query });

    const accounts = await findAccount(query);

    accounts.forEach((account) => {
      results.push({ address: account.address!, name: account.name, profilePhoto: account.profilePhoto });
    });

    return results;
  }),
  completeCustodialOnboarding: procedure
    .input(
      z.object({
        name: z.string(),
        occupation: z.number(),
        openTo: z.array(z.number()),
        idealCollab: z.array(z.number()),
        projectGoals: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, occupation, openTo, idealCollab, projectGoals } = input;
      const accessToken = ctx.req.cookies.access_token; console.log('accessToken', accessToken);
      const address = await getAddressByAccessToken(accessToken!); console.log('address', address);
      if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No address found for access token' });

      const updatedAccount = await updateAccount(address, {
        name,
        occupation,
        openTo,
        idealCollab,
        projectGoals,
        custodialOnboarded: true,
      });
      return updatedAccount;
    }),
});
