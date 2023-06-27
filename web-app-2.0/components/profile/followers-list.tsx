import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Account } from '@/types/account';
import ProfileLink from '../common/profile-link';
import { trpc } from '@/utils/trpc';

type FollowersListProps = {
  account: Account;
};

export type FollowersListRef = {
  showModal: () => void;
};

const FollowersList = ({ account }: FollowersListProps, ref: React.Ref<FollowersListRef>) => {
  const [open, setOpen] = useState(false);

  const { data: list, isLoading: getting } = trpc.accounts.getFollowers.useQuery(
    { address: account.address! },
    { enabled: open }
  );

  useImperativeHandle(ref, () => ({
    showModal() {
      setOpen(true);
    },
  }));

  const close = () => {
    setOpen(false);
  };

  const fieldStyle = {
    m: 1,
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {`${account.name}'s`} Followers {getting && <CircularProgress size="10pt" />}
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            {list?.map((item) => {
              return (
                <Grid
                  item
                  xs={6}
                  md={4}
                  lg={3}
                  key={item.address}
                >
                  <ProfileLink
                    address={item.address}
                    onClick={close}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={close}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default forwardRef(FollowersList);
