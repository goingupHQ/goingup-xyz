import { procedure, router } from '../trpc';
import { emailsRouter } from './emails.router';
import { eventPartnersRouter } from './event-partners.router';
import { eventTokensRouter } from './event-tokens.router';

export const appRouter = router({
  eventPartners: eventPartnersRouter,
  eventTokens: eventTokensRouter,
  emails: emailsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;