import { GoingUpEventTokensV1__factory } from '@/typechain';
import { ethers } from 'ethers';
import { router, procedure } from '../trpc';
import { z } from 'zod';
import { validateSignature } from '@/utils/web3-signature';

const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);
const goingUpEventTokens = GoingUpEventTokensV1__factory.connect(process.env.GEVENT_TOKENS_ADDR, provider);

export const eventTokensRouter = router({
  get: procedure
    .input(
      z.object({
        tokenId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const tokenSettings = await goingUpEventTokens.tokenSettings(input.tokenId);
      let [description, metadataURI] = tokenSettings;
      // convert ipfs uri to gateway
      // example ipfs uri ipfs://bafybeig6jbmhezo6rt3kojsq3hf66pnqkyuq33sz23j23nlmsypo3cvmyy/1.json
      // https://bafybeig6jbmhezo6rt3kojsq3hf66pnqkyuq33sz23j23nlmsypo3cvmyy.ipfs.nftstorage.link/1.json
      if (metadataURI?.startsWith('ipfs://')) {
        const ipfsHash = metadataURI.split('ipfs://')[1].split('/')[0];
        metadataURI = `https://${ipfsHash}.ipfs.nftstorage.link/${input.tokenId}.json`;
      }
      console.log('metadataURI', metadataURI);
      // fetch metadata
      const metadata = await fetch(metadataURI).then((res) => res.json())
        .catch((err) => {
          console.log('error fetching metadata', err);
        });
      console.log(metadata);
      const imageURI = metadata.image;
      // convert ipfs uri to gateway
      if (imageURI?.startsWith('ipfs://')) {
        const ipfsHash = imageURI.split('ipfs://')[1].split('/')[0];
        const filename = imageURI.split('ipfs://')[1].split('/')[1];
        metadata.image = `https://${ipfsHash}.ipfs.nftstorage.link/${filename}`;
      }
      console.log(tokenSettings, metadata);
      return { tokenSettings, metadata };
    }),
  claimToken: procedure
    .input(z.object({ tokenId: z.number(), address: z.string(), message: z.string(), signature: z.string() }))
    .mutation(async ({ input }) => {
      const isSignatureValid = await validateSignature(input.address, input.message, input.signature);
      if (!isSignatureValid) {
        throw new Error('Invalid signature');
      }

      const minterPk = process.env.MINTER_PK;
      if (!minterPk) {
        throw new Error('Minter private key not found');
      }

      const accountBalance = await goingUpEventTokens.balanceOf(input.address, input.tokenId);
      if (accountBalance.gt(0)) {
        throw new Error('Token already claimed');
      }

      // get gas station price
      const response = await fetch('https://gasstation-mainnet.matic.network/v2');
      const data = await response.json();
      const maxFeePerGas = ethers.utils.parseUnits(
        `${Math.ceil(data.fast.maxFee)}`,
        'gwei'
      )
      const maxPriorityFeePerGas = ethers.utils.parseUnits(
        `${Math.ceil(data.fast.maxPriorityFee)}`,
        'gwei'
      )

      const signer = new ethers.Wallet(minterPk, provider);
      const tx = await goingUpEventTokens.connect(signer).manualMint(input.address, input.tokenId, 1, {
        maxFeePerGas,
        maxPriorityFeePerGas,
      });

      return tx;
    }),
});
