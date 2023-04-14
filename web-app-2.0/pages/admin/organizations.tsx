import { trpc } from '@/utils/trpc';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useAccount, useSigner } from 'wagmi';

const Organizations = () => {
  const { mutateAsync: createOrganizationCodes, isLoading } = trpc.organization.createOrgCodes.useMutation();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateOrganizationCodes = async () => {
    if (!signer) {
      enqueueSnackbar('Admin wallet not connected', { variant: 'error' });
      return;
    }

    if (!address) {
      enqueueSnackbar('Admin wallet not connected', { variant: 'error' });
      return;
    }

    const message = `You, ${address}, are about to create organization codes. Confirm by signing this message.`;
    const signature = await signer.signMessage(message);

    await createOrganizationCodes({ message, signature, address });
  };

  return (
    <>
      <Typography variant="h1">Organizations Admin</Typography>

      <Box>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleCreateOrganizationCodes}
        >
          Create Organization Codes
        </Button>
      </Box>
    </>
  );
};

export default Organizations;
