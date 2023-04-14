import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { GoingUpEventTokensV1__factory } from '@/typechain';
import { useSigner } from 'wagmi';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useState } from 'react';
import { BigNumber } from 'ethers';

const EventTokens = () => {
  const { data: signer } = useSigner();
  const eventTokensContract = GoingUpEventTokensV1__factory.connect(
    '0x9CFb64637883e8Af0EF420Af95BF80c4e236229D',
    signer!
  );

  const [tokenSettings, setTokenSettings] = useState<Awaited<
    ReturnType<typeof eventTokensContract.tokenSettings>
  > | null>(null);
  const [tokenIdGet, setTokenIdGet] = useState<string>('');
  const [tokenIdSet, setTokenIdSet] = useState<string>('');
  const [tokenSettingsUpdate, setTokenSettingsUpdate] = useState<Awaited<
    ReturnType<typeof eventTokensContract.tokenSettings>
  > | null>(null);

  return (
    <>
      <Typography variant="h1">Event Tokens</Typography>

      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-evenly"
        sx={{ my: 2 }}
      >
        <Paper sx={{ p: 3, minWidth: '30%' }}>
          <Stack
            spacing={2}
            alignItems="flex-start"
          >
            <Typography variant="h6">Get Token Settings</Typography>

            <TextField
              label="Token ID"
              value={tokenIdGet}
              onChange={(e) => setTokenIdGet(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const tokenSettings = await eventTokensContract.tokenSettings(tokenIdGet);

                setTokenSettings(tokenSettings);
              }}
            >
              Get Token Settings
            </Button>

            {tokenSettings && (
              <>
                <Typography variant="body1">Description: {tokenSettings.description}</Typography>
                <Typography variant="body1">Metadata URI: {tokenSettings.metadataURI}</Typography>
                <Typography variant="body1">Owner: {tokenSettings.owner}</Typography>
                <Typography variant="body1">Price: {tokenSettings.price.toBigInt().toString()}</Typography>
                <Typography variant="body1">
                  Cannot Mint After: {tokenSettings.cantMintAfter.toBigInt().toString()}
                </Typography>
                <Typography variant="body1">Max Supply: {tokenSettings.maxSupply.toBigInt().toString()}</Typography>
                <Typography variant="body1">
                  Max Per Address: {tokenSettings.maxPerAddress.toBigInt().toString()}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setTokenIdSet(tokenIdGet);
                    setTokenSettingsUpdate(tokenSettings)}
                  }
                >
                  Copy to Update Form <KeyboardDoubleArrowRightIcon />
                </Button>
              </>
            )}
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, minWidth: '30%' }}>
          <Stack
            spacing={2}
            alignItems="flex-start"
          >
            <Typography variant="h6">Set Token Settings</Typography>

            <TextField
              label="Token ID"
              value={tokenIdSet}
              onChange={(e) => setTokenIdSet(e.target.value)}
            />

            <TextField
              label="Description"
              value={tokenSettingsUpdate?.description ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                description: e.target.value,
              })}
              fullWidth
            />

            <TextField
              label="Metadata URI"
              value={tokenSettingsUpdate?.metadataURI ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                metadataURI: e.target.value,
              })}
              fullWidth
            />

            <TextField
              label="Owner"
              value={tokenSettingsUpdate?.owner ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                owner: e.target.value,
              })}
              fullWidth
            />

            <TextField
              label="Price"
              value={tokenSettingsUpdate?.price.toBigInt().toString() ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                price: BigNumber.from(e.target.value),
              })}
            />

            <TextField
              label="Cannot Mint After"
              value={tokenSettingsUpdate?.cantMintAfter.toBigInt().toString() ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                cantMintAfter: BigNumber.from(e.target.value),
              })}
            />

            <TextField
              label="Max Supply"
              value={tokenSettingsUpdate?.maxSupply.toBigInt().toString() ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                maxSupply: BigNumber.from(e.target.value),
              })}
            />

            <TextField
              label="Max Per Address"
              value={tokenSettingsUpdate?.maxPerAddress.toBigInt().toString() ?? ''}
              onChange={(e) => setTokenSettingsUpdate({
                ...tokenSettingsUpdate!,
                maxPerAddress: BigNumber.from(e.target.value),
              })}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                await eventTokensContract.setTokenSettings(
                  tokenIdSet,
                  tokenSettingsUpdate!.description,
                  tokenSettingsUpdate!.metadataURI,
                  tokenSettingsUpdate!.owner,
                  tokenSettingsUpdate!.price,
                  tokenSettingsUpdate!.cantMintAfter,
                  tokenSettingsUpdate!.maxSupply,
                  tokenSettingsUpdate!.maxPerAddress,
                );
              }}
            >
              Set Token Settings
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
};

export default EventTokens;
