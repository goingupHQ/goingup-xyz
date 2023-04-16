import { Organization } from '@/types/organization';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useAccount } from 'wagmi';
import { NFTStorage } from 'nft.storage';

type CreateRewardTokenProps = {
  org: Organization;
};

const CreateRewardToken = ({ org }: CreateRewardTokenProps) => {
  const { isConnected } = useAccount();
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tokenImageFile, setTokenImageFile] = React.useState<File | null>(null);

  const handleCreateClick = async () => {
    // if (!isConnected) {
    //   enqueueSnackbar('Please connect your wallet first', { variant: 'error' });
    //   return;
    // }

    if (tokenImageFile) {
      console.log('tokenImageFile', tokenImageFile);
      const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY });

      const response = await client.store({
        name: 'Test Name',
        description: 'Test Description',
        image: tokenImageFile
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenImageFile(file);
    }
  };

  return (
    <>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />

      <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={handleCreateClick}
      >
        Create a reward token
      </Button>


    </>
  );
};

export default CreateRewardToken;
