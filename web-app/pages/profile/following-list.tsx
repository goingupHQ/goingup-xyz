import ProfileLink from '@/components/common/ProfileLink';
import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    CircularProgress
} from '@mui/material';
import {
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect
} from 'react';

const FollowingList = (props, ref) => {
    const { account } = props;
    const [open, setOpen] = useState(false);
    const [getting, setGetting] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (open) {
            setGetting(true);
            fetch(`/api/get-following?address=${account.address}`)
                .then(async response => {
                    const result = await response.json();
                    setList(result);
                })
                .finally(() => setGetting(false));
        }
    }, [open])

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        }
    }));

    const close = () => {
        setList([]);
        setOpen(false);
    };

    const fieldStyle = {
        m: 1
    };

    return (
        <div>
            <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>
                    {account.name} Follows {getting && <CircularProgress size="10pt" />}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {list.map(item => { return (
                            <Grid item xs={6} md={4} lg={3}  key={item._id}>
                                <ProfileLink profile={item.profile[0]} hideReputationScore onClick={close} />
                            </Grid>
                        )})}
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
