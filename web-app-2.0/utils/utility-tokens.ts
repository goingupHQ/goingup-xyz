import { GoingUpUtilityTokens__factory } from '@/typechain';
import { getDb } from './database';
import { Signer, ethers } from 'ethers';

export const getUtilityTokenContract = (providerOrSigner?: ethers.providers.Provider | Signer) => {
  if (!providerOrSigner) {
    providerOrSigner = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);
  }

  return GoingUpUtilityTokens__factory.connect(process.env.NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN, providerOrSigner);
};

export const getMaxTokenId = async (): Promise<number> => {
  const db = await getDb();

  const col = db.collection<UtilityTokenSupply>('utility-token-supply');
  const record = await col.find().sort({ tokenId: -1 }).limit(1).toArray();
  const maxInDb = record[0]?.tokenId ?? 0;

  // iterate tokenSettings in contract
  const contract = getUtilityTokenContract();

  let maxInContract = 0;
  let i = maxInDb;

  while (true) {
    const tokenSettings = await contract.tokenSettings(i);
    const { description, metadataURI, category, tier, price } = tokenSettings;

    if (description === '' && metadataURI === '' && category.eq(0) && tier.eq(0) && price.eq(0)) {
      break;
    }

    maxInContract = i;
    i++;
  }

  return Math.max(maxInDb, maxInContract);
};

export const getNextTokenId = async (): Promise<number> => {
  const maxTokenId = await getMaxTokenId();
  let nextTokenId = maxTokenId + 1;
  let lockedTokens = await getLockedTokenIds();

  while (lockedTokens.includes(nextTokenId)) {
    nextTokenId++;
    lockedTokens = await getLockedTokenIds();
  }

  return nextTokenId;
};

export const lockTokenId = async (tokenId: number) => {
  const db = await getDb();

  const col = db.collection<UtilityTokenConfig>('utility-token-config');
  await col.updateOne(
    {
      configId: 'default',
    },
    {
      $push: {
        lockedTokenIds: tokenId,
      },
    },
    {
      upsert: true,
    }
  );
};

export const unlockTokenId = async (tokenId: number) => {
  const db = await getDb();

  const col = db.collection<UtilityTokenConfig>('utility-token-config');
  await col.updateOne(
    {
      configId: 'default',
    },
    {
      $pull: {
        lockedTokenIds: tokenId,
      },
    },
    {
      upsert: true,
    }
  );
};

export const getLockedTokenIds = async (): Promise<number[]> => {
  const db = await getDb();

  const col = db.collection<UtilityTokenConfig>('utility-token-config');
  const record = await col.findOne({ configId: 'default' });
  return record?.lockedTokenIds ?? [];
};
