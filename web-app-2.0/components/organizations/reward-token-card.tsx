import { GoingUpUtilityTokens__factory } from '@/typechain';
import { GenericNftMetadata } from '@/types/utility-token';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React from 'react';

type RewardTokenCardProps = {
  rewardTokenId: number;
};

const RewardTokenCard = ({ rewardTokenId }: RewardTokenCardProps) => {
  const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY);
  const utilityContract = GoingUpUtilityTokens__factory.connect(
    process.env.NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN,
    polygonProvider
  );

  const { tokenSettings: tokenSettingsMapping } = utilityContract;
  const [tokenSettings, setTokenSettings] = React.useState<Awaited<ReturnType<typeof tokenSettingsMapping>> | null>(
    null
  );

  React.useEffect(() => {
    setIsFetchingMetadata(true);
    utilityContract.tokenSettings(rewardTokenId).then((settings) => {
      setTokenSettings(settings);
    }).catch((err) => {
      console.log(err);
      setIsFetchingMetadata(false);
    })

  }, [rewardTokenId]);

  const [isFetchingMetadata, setIsFetchingMetadata] = React.useState(false);
  const [metadata, setMetadata] = React.useState<GenericNftMetadata | null>(null);

  React.useEffect(() => {
    const fetchMetadata = async () => {
      setIsFetchingMetadata(true);

      try {
        if (tokenSettings === null) return;

        const metadataURIParts = tokenSettings.metadataURI.replace('ipfs://', '').split('/');
        metadataURIParts[0] += '.ipfs.nftstorage.link';
        const metadataURI = `https://${metadataURIParts.join('/')}`;

        const response = await fetch(metadataURI);
        const data = (await response.json()) as GenericNftMetadata;

        const imageURIParts = data.image.replace('ipfs://', '').split('/');
        data.image = `https://cloudflare-ipfs.com/ipfs/${imageURIParts.join('/')}`;
        // imageURIParts[0] += '.ipfs.nftstorage.link';
        // data.image = `https://${imageURIParts.join('/')}`;
        console.log(data);

        setMetadata(data);
      } catch (err) {
      } finally {
        setIsFetchingMetadata(false);
      }
    };

    fetchMetadata();
  }, [tokenSettings]);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      {isFetchingMetadata && (
        <>
          <Skeleton variant="rounded" width={100} height={100} />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </>
      )}

      {!isFetchingMetadata && metadata !== null && (
        <>
          <Box
            component="img"
            src={metadata?.image}
            sx={{ width: 100, height: 100, my: 2, borderRadius: '5px' }}
          />
          <Typography variant="h6">{metadata?.name}</Typography>
          <Typography variant="body1">{metadata?.description}</Typography>
        </>
      )}
    </Paper>
  );
};

export default RewardTokenCard;
