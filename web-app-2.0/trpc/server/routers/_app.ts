import { procedure, router } from '../trpc';
import { emailsRouter } from './emails.router';
import { eventPartnersRouter } from './event-partners.router';
import { eventTokensRouter } from './event-tokens.router';
import { organizationsRouter } from './organizations';

export const appRouter = router({
  eventPartners: eventPartnersRouter,
  eventTokens: eventTokensRouter,
  emails: emailsRouter,
  organization: organizationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;