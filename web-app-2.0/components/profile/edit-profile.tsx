import { AppContext, Availability, Occupation, UserGoal } from '@/contexts/app-context';
import { WalletContext } from '@/contexts/wallet-context';
import { Account } from '@/types/account';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import AvailabilitySelect from '../common/availability-select';
import OccupationSelect from '../common/occupation-select';
import UserGoalSelect from '../common/user-goal-select';
import OccupationMultiSelect from '../common/occupation-multi-select';
import { trpc } from '@/utils/trpc';

type EditProfileProps = {
  account: Account;
  refresh?: () => void;
};

export type EditProfileRef = {
  showModal: () => void;
};

const EditProfile = ({ account, refresh }: EditProfileProps, ref: React.Ref<EditProfileRef>) => {
  const wallet = useContext(WalletContext);
  const appContext = useContext(AppContext);
  const { availability, occupations, userGoals } = appContext;

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(account.name);
  const [about, setAbout] = useState<string | undefined>(account.about);
  const [occupation, setOccupation] = useState<Occupation | null>(
    occupations.find((o) => o.id === account.occupation) ?? null
  );
  const [openTo, setOpenTo] = useState<Availability[]>(
    account.openTo?.map((o) => availability.find((a) => a.id === o)!) ?? []
  );
  const [projectGoals, setProjectGoals] = useState<UserGoal[]>(
    account.projectGoals?.map((p) => userGoals.find((u) => u.id === p)!) ?? []
  );
  const [idealCollab, setIdealCollab] = useState<Occupation[]>(
    account.idealCollab?.map((i) => occupations.find((o) => o.id === i)!) ?? []
  );
  const [isDeleted, setIsDeleted] = useState<string | boolean | undefined>(account.isDeleted);

  const [saving, setSaving] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  useImperativeHandle(ref, () => ({
    showModal() {
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const fieldStyle = {
    m: 1,
  };

  const {
    mutateAsync: deleteAccount,
    isLoading: deleting,
    isSuccess: deleteSuccess,
    isError: deleteFail,
  } = trpc.accounts.delete.useMutation();

  useEffect(() => {
    if (deleteSuccess) {
      enqueueSnackbar('Account deleted', { variant: 'success' });
      if (refresh) refresh();
      setOpen(false);
      setIsDeleted(true);
    }

    if (deleteFail) {
      enqueueSnackbar('Failed to delete account', {
        variant: 'error',
      });
    }
  }, [deleteSuccess, deleteFail]);

  const {
    mutateAsync: recoverAccount,
    isLoading: recovering,
    isSuccess: recoverSuccess,
    isError: recoverFail,
  } = trpc.accounts.recover.useMutation();

  useEffect(() => {
    if (recoverSuccess) {
      enqueueSnackbar('Account recovered', { variant: 'success' });
      if (refresh) refresh();
      setIsDeleted(false);
      setOpen(false);
    }

    if (recoverFail) {
      enqueueSnackbar('Failed to recover account', {
        variant: 'error',
      });
    }
  }, [recoverSuccess, recoverFail]);

  const saveChanges = async () => {
    setSaving(true);

    try {
      const { address, ethersSigner } = wallet;
      const message = 'update-account';
      const signature = await wallet.signMessage(message);

      const response = await fetch('/api/update-account/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          account: {
            name,
            about,
            occupation: occupation?.id || null,
            openTo: openTo.map((o) => o.id),
            projectGoals: projectGoals.map((p) => p.id),
            idealCollab: idealCollab.map((i) => i.id),
          },
        }),
      });

      if (response.status === 200) {
        enqueueSnackbar('Profile changes saved', { variant: 'success' });
        if (refresh) refresh();
        setOpen(false);
      } else if (response.status >= 400) {
        enqueueSnackbar('Failed to save profile changes', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Failed to save profile changes', { variant: 'error' });
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Edit your GoingUP Profile</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'autofill',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            <TextField
              label="Your Name"
              placeholder="You can give a nickname, prefered name or alias"
              variant="outlined"
              required
              sx={fieldStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="About you"
              placeholder="Introduce yourself to the community"
              variant="outlined"
              sx={fieldStyle}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              multiline
            />

            <FormControl
              sx={fieldStyle}
              required
            >
              <OccupationSelect
                value={occupation}
                setValue={setOccupation}
              />
            </FormControl>

            <FormControl
              sx={fieldStyle}
              required
            >
              <AvailabilitySelect
                value={openTo}
                setValue={setOpenTo}
                label="I am open to..."
              />
            </FormControl>

            <FormControl
              sx={fieldStyle}
              required
            >
              <UserGoalSelect
                value={projectGoals}
                setValue={setProjectGoals}
              />
            </FormControl>

            <FormControl
              sx={fieldStyle}
              required
            >
              <OccupationMultiSelect
                value={idealCollab}
                setValue={setIdealCollab}
                label="I would like to collaborate with..."
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {isDeleted ? (
            <LoadingButton
              color="secondary"
              variant="outlined"
              loading={recovering}
              onClick={() => recoverAccount()}
            >
              Recover My Account
            </LoadingButton>
          ) : (
            <LoadingButton
              color="secondary"
              variant="outlined"
              loading={deleting}
              onClick={() => deleteAccount()}
            >
              Delete My Account
            </LoadingButton>
          )}
          <Button
            color="secondary"
            variant="contained"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={saving}
            loadingIndicator="Saving..."
            color="primary"
            variant="contained"
            onClick={saveChanges}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default forwardRef(EditProfile);
