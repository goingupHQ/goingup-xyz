import { EventPartner } from '@/types/app-types';
import { getDb } from '@/utils/database';
import { z } from 'zod';
import { router, procedure } from '../trpc';

export const eventPartnersRouter = router({
  get: procedure
    .input(
      z.object({
        partnerOrgCode: z.string({
          required_error: 'Partner organization code is required',
        }),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const data = await db.collection<EventPartner>('event-partners').findOne({ partnerOrg: input.partnerOrgCode });

      return data;
    }),
});
