import { Organization } from '@/types/organization';
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { NFTStorage } from 'nft.storage';
import { LoadingButton } from '@mui/lab';
import { trpc } from '@/utils/trpc';

type CreateRewardTokenProps = {
  org: Organization;
};

const CreateRewardToken = ({ org }: CreateRewardTokenProps) => {
  const { isConnected } = useAccount();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tokenImageFile, setTokenImageFile] = React.useState<File | null>(null);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = (event, reason?) => {
    if (reason === 'backdropClick') {
      return;
    }
    setModalOpen(false);
  };

  const handleCreateClick = async () => {
    if (!isConnected) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' });
      return;
    }

    setModalOpen(true);
  };

  const [tokenName, setTokenName] = React.useState('');
  const [tokenDescription, setTokenDescription] = React.useState('');

  type TokenAttribute = {
    trait_type: string;
    value: string;
  };

  const [tokenAttributes, setTokenAttributes] = React.useState<TokenAttribute[]>([]);

  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = e.target ? (e.target.result as string) : null;
        setPreviewImg(img);
      };

      reader.readAsDataURL(file);
    }
  };

  const {
    mutateAsync: createRewardToken,
    isLoading: isCreatingRewardToken,
    isSuccess: rewardTokenCreated,
    isError: rewardTokenCreateFailed,
  } = trpc.organizations.createRewardToken.useMutation();

  const context = trpc.useContext();

  const [isCreating, setIsCreating] = React.useState(false);
  const handleCreateRewardTokenClick = async () => {
    if (!isConnected) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' });
      return;
    }

    if (!tokenImageFile) {
      enqueueSnackbar('Please select a token image', { variant: 'error' });
      return;
    }

    if (!tokenName) {
      enqueueSnackbar('Please enter a token name', { variant: 'error' });
      return;
    }

    if (!tokenDescription) {
      enqueueSnackbar('Please enter a token description', { variant: 'error' });
      return;
    }

    setIsCreating(true);

    try {
      const message = `I am signing this message as owner of ${org.name} to create a reward token called ${tokenName}`;
      const signature = await signer?.signMessage(message);
      const address = await signer?.getAddress();

      if (!address) {
        enqueueSnackbar('Failed to get wallet address', { variant: 'error' });
        return;
      }

      if (!signature) {
        enqueueSnackbar('Failed to sign message', { variant: 'error' });
        return;
      }

      if (tokenImageFile) {
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY });

        const metadata = await client.store({
          name: tokenName,
          description: tokenDescription,
          attributes: tokenAttributes,
          image: tokenImageFile,
        });

        const { code } = org;
        const response = await createRewardToken({
          code,
          message,
          address,
          signature,
          tokenName,
          tokenDescription,
          tokenMetadataURI: metadata.url,
        });

        if (response.tx) {
          const tx = await signer?.provider?.getTransaction(response.tx.hash);
          const key = enqueueSnackbar('Waiting for confirmation...', {
            variant: 'info',
            persist: true,
            action: (key) => {
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    window.open(`${chain?.blockExplorers?.default.url}/tx/${response.tx.hash}`, '_blank');
                  }}
                >
                  View on Etherscan
                </Button>
              );
            },
          });

          setModalOpen(false);
          setPreviewImg(null);
          setTokenImageFile(null);
          setTokenName('');
          setTokenDescription('');
          setTokenAttributes([]);

          await tx?.wait(2);
          closeSnackbar(key);
          await context.organizations.invalidate();
        }
      }
    } catch (e) {
      enqueueSnackbar('Failed to create reward token', { variant: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={handleCreateClick}
      >
        Create a new reward token
      </Button>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Stack
            direction="column"
            spacing={2}
          >
            <Typography variant="h5">Create a reward token</Typography>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <Stack
              direction="row"
              spacing={2}
            >
              <Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {tokenImageFile ? 'Change Token Image' : 'Select Token Image'}
                </Button>
              </Box>

              {/* <Typography>{tokenImageFile ? tokenImageFile.name : 'No image selected'}</Typography> */}

              {previewImg && (
                <Box
                  component="img"
                  src={previewImg}
                  sx={{ width: 100, height: 100, my: 2, borderRadius: 1 }}
                />
              )}
            </Stack>

            <TextField
              label="Token Name"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />

            <TextField
              label="Token Description"
              value={tokenDescription}
              multiline
              rows={3}
              onChange={(e) => setTokenDescription(e.target.value)}
            />

            {tokenAttributes.length === 0 ? (
              <Typography variant="body2">No attributes added</Typography>
            ) : (
              <Typography variant="body2">
                {tokenAttributes.length} Attribute{tokenAttributes.length > 1 ? 's' : ''} added
              </Typography>
            )}
            {tokenAttributes.map((attr, i) => (
              <Stack
                direction="row"
                spacing={2}
                key={i}
                justifyContent="stretch"
                sx={{ width: '100%' }}
              >
                <TextField
                  label="Attribute Name"
                  value={attr.trait_type}
                  onChange={(e) => {
                    const newAttrs = [...tokenAttributes];
                    newAttrs[i].trait_type = e.target.value;
                    setTokenAttributes(newAttrs);
                  }}
                />

                <TextField
                  label="Attribute Value"
                  value={attr.value}
                  onChange={(e) => {
                    const newAttrs = [...tokenAttributes];
                    newAttrs[i].value = e.target.value;
                    setTokenAttributes(newAttrs);
                  }}
                />

                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    const newAttrs = [...tokenAttributes];
                    newAttrs.splice(i, 1);
                    setTokenAttributes(newAttrs);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            ))}

            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setTokenAttributes([...tokenAttributes, { trait_type: '', value: '' }]);
                }}
              >
                Add Attribute
              </Button>
            </Box>

            <Stack
              direction="row"
              spacing={2}
            >
              <LoadingButton
                size="large"
                variant="contained"
                color="primary"
                loading={isCreating || isCreatingRewardToken}
                onClick={handleCreateRewardTokenClick}
              >
                Create Reward Token
              </LoadingButton>

              <Button
                variant="text"
                color="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRewardToken;
