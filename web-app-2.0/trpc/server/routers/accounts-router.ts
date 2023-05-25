import { z } from 'zod';
import { router, procedure } from '../trpc';
import { findAccount, getAccount } from '@/utils/database/account';
import { ethers } from 'ethers';
import { AddressOrAccountSearchResult } from '@/types/account';

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
});