import { z } from 'zod';
import { getAccount } from '../../../utils/database/account';
import { router, procedure } from '../trpc';

export const accountsRouter = router({
  get: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    return getAccount(input.address);
  }),
});
