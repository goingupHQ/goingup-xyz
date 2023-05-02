import { trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

const CreateGroup = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const code = router.query.code as string;
  const [modalOpen, setModalOpen] = useState(false);
  const { data: signer } = useSigner();

  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const {
    mutateAsync: createGroup,
    isLoading: isCreatingGroup,
    isSuccess: isGroupCreated,
    isError: isGroupNotCreated,
  } = trpc.organizations.syncGroup.useMutation();

  const createGroupHandler = async () => {
    if (!groupCode) {
      enqueueSnackbar('Group Code is required', { variant: 'error' });
      return;
    }

    if (!groupName) {
      enqueueSnackbar('Group Name is required', { variant: 'error' });
      return;
    }

    if (!groupDescription) {
      enqueueSnackbar('Group Description is required', { variant: 'error' });
      return;
    }

    try {
      const message = `Create Group: ${groupCode} - ${groupName} - ${groupDescription}`;
      const signature = await signer?.signMessage(message);
      if (!signature) {
        enqueueSnackbar('Failed to sign message', { variant: 'error' });
        return;
      }
      const address = await signer?.getAddress();
      if (!address) {
        enqueueSnackbar('Failed to get address', { variant: 'error' });
        return;
      }

      await createGroup({
        group: {
          code: groupCode,
          name: groupName,
          description: groupDescription,
        },
        code,
        signature,
        message,
        address,
      });
      enqueueSnackbar('Group created successfully', { variant: 'success' });
      setModalOpen(false);
    } catch (error) {
      enqueueSnackbar('Failed to create group', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (isGroupCreated) {
      setGroupCode('');
      setGroupName('');
      setGroupDescription('');
      setModalOpen(false);
      enqueueSnackbar('Group created successfully', { variant: 'success' });
    }

    if (isGroupNotCreated) {
      enqueueSnackbar('Failed to create group', { variant: 'error' });
    }
  }, [isGroupCreated, isGroupNotCreated]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
      >
        Create Group...
      </Button>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogContent sx={{ minWidth: { xs: 'initial', md: '500px' } }}>
          <Stack
            spacing={2}
            direction="column"
          >
            <Typography variant="h5">Create Group</Typography>

            <TextField
              label="Group Code"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
            />
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <TextField
              label="Group Description"
              multiline
              rows={3}
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />

            <Box sx={{ mt: 2 }}>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={isCreatingGroup}
                onClick={createGroupHandler}
              >
                Create Group
              </LoadingButton>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGroup;
