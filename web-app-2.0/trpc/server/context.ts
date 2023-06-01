import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const { req, res } = opts;

  const session = {
    accessToken: req.cookies.access_token,
  }; console.log('session', session);

  return {
    req,
    res,
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
