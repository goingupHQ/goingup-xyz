import { procedure, router } from '../trpc';
import { eventTokensRouter } from './event-tokens.router';

export const appRouter = router({
  eventTokens: eventTokensRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;