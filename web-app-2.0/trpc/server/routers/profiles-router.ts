import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getAddressByAccessToken } from '@/utils/database/auth';
import { Account } from '@/types/account';
import { getAccount, getPotentialCollaborators, searchForProfiles } from '@/utils/database/account';

export const profilesRouter = router({
  getPotentialCollaborators: procedure
    .input(
      z.object({
        count: z.number().optional().default(12),
        onlyProfilesWithPhotos: z.boolean().optional().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      const { accessToken } = ctx;
      let userAddress: string | null = null;
      if (accessToken) {
        userAddress = await getAddressByAccessToken(accessToken);
      }

      const { count, onlyProfilesWithPhotos } = input;
      let userAccount: Account | null = null;
      if (userAddress) {
        userAccount = await getAccount(userAddress);
      }

      const profiles = await getPotentialCollaborators(count, onlyProfilesWithPhotos, userAccount);
      return profiles;
    }),
  searchForProfiles: procedure
    .input(
      z.object({
        nameQuery: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('profilesRouter.searchForProfiles');
      const { nameQuery } = input;
      const profiles = await searchForProfiles(nameQuery);
      return profiles;
    }),
});
