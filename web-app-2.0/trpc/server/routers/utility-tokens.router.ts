import { ethers } from 'ethers';
import { procedure, router } from '../trpc';
import { z } from 'zod';
import { getAddressByAccessToken } from '@/utils/database/auth';
import { TRPCError } from '@trpc/server';
import { getAccountByAccessToken } from './auth';
import { decrypt } from '@/utils/kms';
import { GoingUpUtilityTokens__factory } from '@/typechain';

const mainnet = {
  chainId: 137,
  chainName: 'Polygon Mainnet',
  address: '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2',
  get provider() {
    return new ethers.providers.InfuraProvider(this.chainId, process.env.NEXT_PUBLIC_INFURA_KEY);
    // return new ethers.providers.AlchemyProvider(this.chainId, process.env.ALCHEMY_POLYGON_MAINNET);
  },
};

const testnet = {
  chainId: 80001,
  chainName: 'Polygon Mumbai Testnet',
  address: '0x825D5014239a59d7587b9F53b3186a76BF58aF72',
  get provider() {
    return new ethers.providers.AlchemyProvider(this.chainId, process.env.ALCHEMY_POLYGON_TESTNET);
  },
};

export const utilityTokensRouter = router({
  sendTokenFromCustodialWallet: procedure
    .input(
      z.object({
        chainId: z.number(),
        tokenId: z.number(),
        to: z.string(),
        amount: z.number(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(ctx.session.accessToken);
      if (!ctx.session.accessToken) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Access token not found' });

      const account = await getAccountByAccessToken(ctx.session.accessToken);
      if (!account) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Account not found' });

      if (!account.isCustodial) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Account is not custodial' });
      const { chainId, tokenId, to, amount, message } = input;

      const contractAddress = chainId == 137 ? mainnet.address : testnet.address;

      const { encryptedPrivateKey } = account;
      if (!encryptedPrivateKey)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No encrypted private key found' });

      const decryptionResult = await decrypt(encryptedPrivateKey);
      const wallet = new ethers.Wallet(decryptionResult.plainText, mainnet.provider);
      const utilityTokensContract = GoingUpUtilityTokens__factory.connect(contractAddress, wallet);

      const settings = await utilityTokensContract.tokenSettings(tokenId); console.log(settings);

      const gasRecommendation = await getPolygonGasRecommendation('Fast'); console.log(gasRecommendation);
      const maxFee = ethers.utils.parseUnits(Math.ceil(gasRecommendation.maxFee).toString(), 'gwei');
      const maxPriorityFee = ethers.utils.parseUnits(Math.ceil(gasRecommendation.maxPriorityFee).toString(), 'gwei');

      const tx = await utilityTokensContract.mint(to, tokenId, amount, Boolean(message), message, {
        value: settings.price.mul(amount),
        maxFeePerGas: maxFee,
        maxPriorityFeePerGas: maxPriorityFee,
      });

      return tx;
    }),
});

type PolygonGasRecommendation = {
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
};

const getPolygonGasRecommendation = async (speed: 'SafeLow' | 'Standard' | 'Fast') => {
  let recommendation = {
    maxPriorityFee: 50,
    maxFee: 200,
  };
  const response = await fetch('https://gasstation-mainnet.matic.network/v2');
  const rawJson = await response.json(); console.log(rawJson);
  const json = rawJson as PolygonGasRecommendation;

  if (response.ok) {
    switch (speed) {
      case 'SafeLow':
        recommendation = json.safeLow;
        break;
      case 'Standard':
        recommendation = json.standard;
        break;
      case 'Fast':
        recommendation = json.fast;
        break;
    }
  }

  return recommendation;
};
