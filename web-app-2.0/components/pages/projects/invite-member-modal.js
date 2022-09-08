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
import { forwardRef, useContext, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { WalletContext } from '../../../contexts/wallet-context';
import { AppContext } from '../../../contexts/app-context';
import AddressInput from '../../common/address-input';
import { UtilityTokensContext } from '../../../contexts/utility-tokens-context';

const InviteMemberModal = (props, ref) => {
    const [open, setOpen] = useState(false);
    const wallet = useContext(WalletContext);
    const utilityTokensCtx = useContext(UtilityTokensContext);

    const utilityTokens = utilityTokensCtx.utilityTokens;

    const addressInputRef = useRef(null);

    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [goal, setGoal] = useState('');
    const [selectedTokenCategory, setSelectedTokenCategory] = useState('');
    const [tokens, setTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');

    const { project } = props;

    useEffect(() => {
        if (wallet.address) setOpen(false);
    }, [wallet.address]);

    useImperativeHandle(ref, () => ({
        showModal() {
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
                            onChange={setAddress}
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
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-start">
                            <Button variant="contained" color="primary">
                                Invite Member
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(InviteMemberModal);
