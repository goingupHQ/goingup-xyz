import { z } from 'zod';
import { router, procedure } from '../trpc';
import { findAccount, getAccount, updateAccount } from '@/utils/database/account';
import { ethers } from 'ethers';
import { Account, AddressOrAccountSearchResult, Follows, FollowsResult } from '@/types/account';
import { getAddressByAccessToken } from '@/utils/database/auth';
import { TRPCError } from '@trpc/server';
import { membershipNftContractAddress } from '@/utils/constants';
import { GoingUpMembership__factory } from '@/typechain';
import { getDb } from '@/utils/database';
import { getAccountByAccessToken } from './auth';

export const accountsRouter = router({
  get: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    return getAccount(input.address);
  }),
  hasAccount: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    const account = await getAccount(input.address);
    return Boolean(account);
  }),
  isMembershipNftHolder: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);
    const contractAddress = membershipNftContractAddress;
    const contract = GoingUpMembership__factory.connect(contractAddress, provider);

    const balance = await contract.balanceOf(input.address);
    return balance.gt(0);
  }),
  getFollowStats: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    const { address } = input;
    const db = await getDb();

    const followers = await db.collection<Follows>('follows').countDocuments({ follows: address });
    const following = await db.collection<Follows>('follows').countDocuments({ address });

    return { followers, following };
  }),
  getFollowing: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    const { address } = input;
    const db = await getDb();

    const following = await db
      .collection<Follows>('follows')
      .aggregate<FollowsResult>([
        { $match: { address } },
        {
          $lookup: {
            from: 'profile-0',
            localField: 'follows',
            foreignField: 'address',
            as: 'profile',
          },
        },
      ])
      .toArray();

    return following;
  }),
  getFollowers: procedure.input(z.object({ address: z.string() })).query(async ({ input }) => {
    const { address } = input;
    const db = await getDb();

    const followers = await db
      .collection<Follows>('follows')
      .aggregate<FollowsResult>([
        { $match: { follows: address } },
        {
          $lookup: {
            from: 'profile-0',
            localField: 'address',
            foreignField: 'address',
            as: 'profile',
          },
        },
      ])
      .toArray();

    return followers;
  }),
  verifyTwitter: procedure
    .input(
      z.object({
        tweetId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken } = ctx.session;
      if (!accessToken) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
      const address = await getAddressByAccessToken(accessToken);
      if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
      const { tweetId } = input;

      const token = process.env.TWITTER_TOKEN;
      const endpointURL = `https://api.twitter.com/2/tweets?ids=${tweetId}&expansions=author_id&user.fields=username,name,id,profile_image_url`;
      const params = {
        ids: tweetId,
        'tweet.fields': 'lang,author_id',
        'user.fields': 'created_at',
      };

      const response = await fetch(endpointURL, {
        headers: {
          'User-Agent': 'v2TweetLookupJS',
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tweet not found' });

      const result = await response.json();
      if (result.data[0].text.indexOf('#GoingUP') === -1)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tweet did not contain #GoingUP' });

      const regex = /0x[a-fA-F0-9]{40}/;
      const matches = result.data[0].text.match(regex);

      if (matches.length === 0)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tweet did not contain your wallet address' });

      if (matches[0] !== address)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tweet did not contain your wallet address' });

      // update account with twitter handle
      const twitter = result.data.includes.users[0].username;
      const twitterUser = result.data.includes.users[0];

      const db = await getDb();
      const accounts = db.collection<Account>('accounts');
      accounts.updateOne({ address }, { $set: { twitter, twitterUser } });
    }),
  searchWithEns: procedure.input(z.object({ query: z.string() })).mutation(async ({ input }) => {
    const { query } = input;
    const results: AddressOrAccountSearchResult[] = [];

    const ethMainnetProvider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);
    const address = await ethMainnetProvider.resolveName(query);

    if (address) results.push({ address, name: query });

    const accounts = await findAccount(query);

    accounts.forEach((account) => {
      results.push({ address: account.address!, name: account.name, profilePhoto: account.profilePhoto });
    });

    return results;
  }),
  completeCustodialOnboarding: procedure
    .input(
      z.object({
        name: z.string(),
        occupation: z.number(),
        openTo: z.array(z.number()),
        idealCollab: z.array(z.number()),
        projectGoals: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, occupation, openTo, idealCollab, projectGoals } = input;
      const { accessToken } = ctx.session;
      const address = await getAddressByAccessToken(accessToken!);
      if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No address found for access token' });

      const updatedAccount = await updateAccount(address, {
        name,
        occupation,
        openTo,
        idealCollab,
        projectGoals,
        custodialOnboarded: true,
      });
      return updatedAccount;
    }),
  update: procedure
    .input(
      z.object({
        name: z.string().optional(),
        about: z.string().optional(),
        occupation: z.number().optional(),
        openTo: z.array(z.number()).optional(),
        projectGoals: z.array(z.number()).optional(),
        idealCollab: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken } = ctx.session;
      if (!accessToken) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
      const address = await getAddressByAccessToken(accessToken);
      if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });

      const db = await getDb();
      const accounts = db.collection<Account>('accounts');

      const { name, about, openTo, projectGoals, idealCollab } = input;
      const $set: Partial<Account> = {
        name,
        about,
        openTo,
        projectGoals,
        idealCollab,
      };
      await accounts.updateOne({ address }, { $set }, { upsert: true, ignoreUndefined: true });
    }),
  delete: procedure.mutation(async ({ ctx }) => {
    const { accessToken } = ctx.session;
    if (!accessToken) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
    const address = await getAddressByAccessToken(accessToken);
    if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });

    const db = await getDb();
    const accounts = db.collection<Account>('accounts');
    await accounts.updateOne({ address }, { $set: { isDeleted: true } });
  }),
  recover: procedure.mutation(async ({ ctx }) => {
    const { accessToken } = ctx.session;
    if (!accessToken) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
    const address = await getAddressByAccessToken(accessToken);
    if (!address) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });

    const db = await getDb();
    const accounts = db.collection<Account>('accounts');
    await accounts.updateOne({ address }, { $set: { isDeleted: false } });
  }),
});
