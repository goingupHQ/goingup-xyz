import { trpc } from '@/utils/trpc';
import { JsonRpcSigner } from '@ethersproject/providers';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const KmsPage = () => {
  const [plainText, setPlainText] = useState<string>('');
  const [cipherText, setCipherText] = useState<string>('');

  const { mutateAsync: encrypt, isLoading: isEncrypting, data: encryptionResult } = trpc.kms.encrypt.useMutation();
  const { mutateAsync: decrypt, isLoading: isDecrypting, data: decryptionResult } = trpc.kms.decrypt.useMutation();

  return (
    <>
      <Typography variant="h1">KMS</Typography>

      <Grid
        container
        columnSpacing={5}
        rowSpacing={5}
        sx={{ mt: 3 }}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            variant="elevation"
            sx={{ p: 4 }}
          >
            <Stack spacing={2}>
              <Typography variant="h5">Encryption</Typography>
              <TextField
                label="Plain Text"
                variant="outlined"
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
              />

              <LoadingButton
                variant="contained"
                onClick={() => encrypt({ plainText })}
                loading={isEncrypting}
              >
                Encrypt
              </LoadingButton>

              <Typography variant="body1">Encryption Result</Typography>
              <TextField
                variant="outlined"
                multiline
                rows={7}
                value={encryptionResult ? JSON.stringify(encryptionResult, null, 2) : ''}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            variant="elevation"
            sx={{ p: 4 }}
          >
            <Stack spacing={2}>
              <Typography variant="h5">Decryption</Typography>
              <TextField
                label="Cipher Text"
                variant="outlined"
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
              />

              <LoadingButton
                variant="contained"
                onClick={() => decrypt({ cipherText })}
                loading={isDecrypting}
              >
                Decrypt
              </LoadingButton>

              <Typography variant="body1">Decryption Result</Typography>
              <TextField
                variant="outlined"
                multiline
                rows={7}
                value={decryptionResult ? JSON.stringify(decryptionResult, null, 2) : ''}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default KmsPage;
