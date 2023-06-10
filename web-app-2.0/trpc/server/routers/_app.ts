import { procedure, router } from '../trpc';
import { accountsRouter } from './accounts-router';
import { authRouter } from './auth';
import { emailsRouter } from './emails-router';
import { eventPartnersRouter } from './event-partners-router';
import { eventTokensRouter } from './event-tokens-router';
import { kmsRouter } from './kms';
import { organizationsRouter } from './organizations-router';
import { profilesRouter } from './profiles-router';
import { utilityTokensRouter } from './utility-tokens.router';

export const appRouter = router({
  eventPartners: eventPartnersRouter,
  eventTokens: eventTokensRouter,
  emails: emailsRouter,
  organizations: organizationsRouter,
  accounts: accountsRouter,
  auth: authRouter,
  kms: kmsRouter,
  profiles: profilesRouter,
  utilityTokens: utilityTokensRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
