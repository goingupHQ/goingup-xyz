import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import { AppContext } from '../../../contexts/app-context';
import AddressInput from '../../common/address-input';
import { UtilityTokensContext } from '../../../contexts/utility-tokens-context';
import { useSnackbar } from 'notistack';
import { ethers } from 'ethers';
import { ProjectsContext } from '../../../contexts/projects-context';

const InviteMemberModal = (props, ref) => {
    const [open, setOpen] = useState(false);
    const wallet = useContext(WalletContext);
    const utilityTokensCtx = useContext(UtilityTokensContext);
    const projectsContext = useContext(ProjectsContext);

    const utilityTokens = utilityTokensCtx.utilityTokens;

    const addressInputRef = useRef(null);

    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [goal, setGoal] = useState('');
    const [selectedTokenCategory, setSelectedTokenCategory] = useState('');
    const [tokens, setTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { project, reload } = props;

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setAddress('');
            setRole('');
            setGoal('');
            setSelectedTokenCategory('');
            setTokens([]);
            setSelectedToken('');
            setRewardAmount('');
            setOpen(true);
            setTimeout(() => {
                addressInputRef.current.focus();
            }, 500);
        },
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const onSelectedTokenCategoryChange = (event) => {
        setSelectedTokenCategory(event.target.value);

        const selectedToken = utilityTokens.find((token) => token.categoryId == event.target.value);
        console.log('selectedToken', selectedToken);
        setTokens(selectedToken.tokenSettings);
    };

    const [inviting, setInviting] = useState(false);
    const inviteMember = async () => {
        try {
            if (!address) throw 'Please enter an address';
            if (!ethers.utils.isAddress(address)) throw 'Please enter a valid address';
            if (!role) throw 'Please select a role';
            if (!goal) throw 'Please enter a goal';
            if (!selectedTokenCategory) throw 'Please select a token category';
            if (!selectedToken) throw 'Please select a token';
            if (!rewardAmount) throw 'Please enter a reward amount';
            if (isNaN(parseInt(rewardAmount))) throw 'Please enter a valid reward amount';

            const rewards = {
                chain: 'polygon',
                type: 'goingup-utility',
                categoryId: parseInt(selectedTokenCategory),
                tokenId: parseInt(selectedToken),
                amount: parseInt(rewardAmount),
            }

            setInviting(true);

            const tx = await projectsContext.inviteProjectMember(project.id, address, role, goal, rewards);

            setOpen(false);

            const shortTxHash = tx.hash.substr(0, 6) + '...' + tx.hash.substr(tx.hash.length - 4, 4);
            const key = enqueueSnackbar(`Member invite transaction submitted (${shortTxHash})`, {
                variant: 'info',
                action: (key) => (
                    <Button variant="contained" color="primary" onClick={() => {
                        console.log('hello' + key);
                        window.open(`${projectsContext.networkParams.blockExplorerUrls[0]}tx/${tx.hash}`, '_blank');
                    }}>Open in Block Explorer</Button>
                ),
                persist: true,
            });

            // const receipt = await tx.wait();
            // closeSnackbar(key);

            tx.wait().then((receipt) => {
                closeSnackbar(key);
                enqueueSnackbar('Member invite transaction confirmed', {
                    variant: 'success',
                });
                reload();
            });

            if (reload) reload();
        } catch (err) {
            if (typeof err === 'string') enqueueSnackbar(err, { variant: 'error' });
            else enqueueSnackbar(err.message, { variant: 'error' });
        } finally {
            setInviting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>
                <Typography variant="h2">Invite Member To {project?.name}</Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingY: 5, paddingTop: 5 }}>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AddressInput
                            ref={addressInputRef}
                            label="Member Address"
                            value={address}
                            setValue={setAddress}
                            autoFocus={true}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Project Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Project Goal"
                            multiline
                            rows={4}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Reward Token Category</InputLabel>
                            <Select
                                label="Reward Token Category"
                                value={selectedTokenCategory}
                                onChange={onSelectedTokenCategoryChange}
                                fullWidth
                            >
                                {utilityTokens.map((token) => {
                                    return (
                                        <MenuItem key={token.categoryId} value={token.categoryId}>
                                            {token.categoryName}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Reward Token</InputLabel>
                            <Select
                                label="Reward Token"
                                value={selectedToken}
                                onChange={(e) => setSelectedToken(e.target.value)}
                                fullWidth
                            >
                                {tokens?.map((token) => {
                                    return (
                                        <MenuItem key={token.id} value={token.id}>
                                            {token.description}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Reward Amount"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            fullWidth
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-start">
                            <LoadingButton loading={inviting} variant="contained" color="primary" onClick={inviteMember}>
                                Invite Member
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(InviteMemberModal);
