import { procedure, router } from '../trpc';
import { eventPartnersRouter } from './event-partners';
import { eventTokensRouter } from './event-tokens.router';

export const appRouter = router({
  eventPartners: eventPartnersRouter,
  eventTokens: eventTokensRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;