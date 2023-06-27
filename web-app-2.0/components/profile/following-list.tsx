import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, CircularProgress } from '@mui/material';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import ProfileLink from '../common/profile-link';
import { Account } from '@/types/account';
import { trpc } from '@/utils/trpc';

type FollowingListProps = {
  account: Account,
};

export type FollowingListRef = {
  showModal: () => void,
};

const FollowingList = ({ account }: FollowingListProps, ref: React.Ref<FollowingListRef>) => {
  const [open, setOpen] = useState(false);

  const { data: list, isLoading: getting } = trpc.accounts.getFollowing.useQuery(
    { address: account.address! },
    { enabled: open }
  );
  console.log('following', list);

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
          {account.name} Follows {getting && <CircularProgress size="10pt" />}
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
                  key={item.address}
                >
                  <ProfileLink
                    address={item.follows}
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
            variant="outlined"
            onClick={close}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default forwardRef(FollowingList);