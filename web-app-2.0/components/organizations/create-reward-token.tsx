import { Organization } from '@/types/organization';
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useAccount, useSigner } from 'wagmi';
import { NFTStorage } from 'nft.storage';

type CreateRewardTokenProps = {
  org: Organization;
};

const CreateRewardToken = ({ org }: CreateRewardTokenProps) => {
  const { isConnected } = useAccount();
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tokenImageFile, setTokenImageFile] = React.useState<File | null>(null);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
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
      const signature = await signer?.signMessage(
        `I am signing this message as owner of ${org.name} to create a reward token called ${tokenName}`
      );

      if (!signature) {
        enqueueSnackbar('Failed to sign message', { variant: 'error' });
        return;
      }

      if (tokenImageFile) {
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY });

        const response = await client.store({
          name: tokenName,
          description: tokenDescription,
          attributes: tokenAttributes,
          image: tokenImageFile,
        });

        console.log(response);
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
        Create a reward token
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
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />

            <Typography variant="h5">Create a reward token</Typography>

            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {tokenImageFile ? 'Change Token Image' : 'Select Token Image'}
              </Button>
            </Box>

            <Typography>{tokenImageFile ? tokenImageFile.name : 'No image selected'}</Typography>

            {previewImg && (
              <Box
                component="img"
                src={previewImg}
                sx={{ width: 100, height: 100, my: 2, borderRadius: 1 }}
              />
            )}

            <TextField
              label="Token Name"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />

            <TextField
              label="Token Description"
              value={tokenDescription}
              multiline
              rows={4}
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

            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleCreateRewardTokenClick}
            >
              Create Reward Token
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRewardToken;
