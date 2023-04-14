import { z } from 'zod';
import { router, procedure } from '../trpc';
import { createOrgCodes, getAll } from '@/utils/database/organization';
import admins from '@/utils/admins.json';
import { validateSignature } from '@/utils/web3-signature';
import { TRPCError } from '@trpc/server';

export const organizationsRouter = router({
  getAll: procedure.query(async () => {
    const orgs = await getAll();
    return orgs;
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
