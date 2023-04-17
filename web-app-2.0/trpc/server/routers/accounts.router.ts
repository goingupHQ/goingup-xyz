import { z } from 'zod';
import { router, procedure } from '../trpc';
import { getAccount } from '@/utils/database/account';

export const accountsRouter = router({
  get: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    return getAccount(input.address);
  }),
});