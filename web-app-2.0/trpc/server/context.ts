import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const { req, res } = opts;

  // get access_token cookie
  const accessToken = req.cookies.access_token;

  return {
    req,
    res,
    accessToken,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;