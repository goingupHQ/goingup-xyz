import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

const EditProfile = (props, ref) => {
    const { account } = props;
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(account.name);
    const [occupation, setOccupation] = useState(account.occupation);
    const [openTo, setOpenTo] = useState(account.openTo);
    const [projectGoals, setProjectGoals] = useState(account.projectGoals);
    const [idealCollab, setIdealCollab] = useState(account.idealCollab);

    const [saving, setSaving] = useState(false);

    const wallet = useContext(WalletContext);
    const appContext = useContext(AppContext);
    const { availability, occupations, userGoals } = appContext;

    const { enqueueSnackbar } = useSnackbar();

    useImperativeHandle(ref, () => ({
        showModal() {
            setOpen(true);
        }
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const fieldStyle = {
        m: 1
    };

    const saveChanges = async ()  => {
        setSaving(true)

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
                        name, occupation, openTo, projectGoals, idealCollab
                    }
                })
            });

            if (response.status === 200) {
                enqueueSnackbar('Profile changes saved', { variant: 'success' });
                props.refresh();
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
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogTitle>Edit your GoingUP Profile</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'autofill',
                                md: 'repeat(2, 1fr)'
                            }
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

                        <FormControl sx={fieldStyle} required>
                            <InputLabel id="occupation-select-label">
                                Occupation
                            </InputLabel>
                            <Select
                                labelId="occupation-select-label"
                                label="Occupation"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            >
                                {occupations.map((o) => {
                                    return (
                                        <MenuItem key={o.id} value={o.id}>
                                            {o.text}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={fieldStyle} required>
                            <InputLabel id="availability-select-label">
                                Open To
                            </InputLabel>
                            <Select
                                labelId="availability-select-label"
                                label="Open To"
                                multiple
                                value={openTo}
                                onChange={(event) => {
                                    const {
                                        target: { value }
                                    } = event;

                                    setOpenTo(
                                        typeof value === 'string'
                                            ? value.split(',')
                                            : value
                                    );
                                }}
                                renderValue={(selected) =>
                                    selected
                                        .map(
                                            (i) =>
                                                availability.find(
                                                    (a) => a.id === i
                                                ).text
                                        )
                                        .join(', ')
                                }
                            >
                                {availability.map((a) => {
                                    return (
                                        <MenuItem key={a.id} value={a.id}>
                                            <Checkbox
                                                checked={
                                                    openTo?.indexOf(a.id) > -1
                                                }
                                            />
                                            <ListItemText primary={a.text} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={fieldStyle} required>
                            <InputLabel id="project-goals-label">
                                What is your primary goal?
                            </InputLabel>
                            <Select
                                labelId="project-goals-label"
                                value={projectGoals}
                                label="What is your primary goal?"
                                multiple
                                onChange={(event) => {
                                    const {
                                        target: { value }
                                    } = event;

                                    setProjectGoals(
                                        typeof value === 'string'
                                            ? value.split(',')
                                            : value
                                    );
                                }}
                                renderValue={(selected) =>
                                    selected
                                        .map(
                                            (i) =>
                                                userGoals.find(
                                                    (ug) => ug.id === i
                                                ).text
                                        )
                                        .join(', ')
                                }
                            >
                                {userGoals.map((ug) => {
                                    return (
                                        <MenuItem key={ug.id} value={ug.id}>
                                            <Checkbox
                                                checked={
                                                    projectGoals?.indexOf(
                                                        ug.id
                                                    ) > -1
                                                }
                                            />
                                            <ListItemText primary={ug.text} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={fieldStyle} required>
                            <InputLabel id="ideal-collaborator-label">
                                Ideal collaborator/s
                            </InputLabel>
                            <Select
                                labelId="ideal-collaborator-label"
                                value={idealCollab}
                                label="Ideal collaborator/s"
                                multiple
                                onChange={(event) => {
                                    const {
                                        target: { value }
                                    } = event;

                                    setIdealCollab(
                                        typeof value === 'string'
                                            ? value.split(',')
                                            : value
                                    );
                                }}
                                renderValue={(selected) =>
                                    selected
                                        .map(
                                            (i) =>
                                                occupations.find(
                                                    (ug) => ug.id === i
                                                ).text
                                        )
                                        .join(', ')
                                }
                            >
                                {occupations.map((o) => {
                                    return (
                                        <MenuItem key={o.id} value={o.id}>
                                            <Checkbox
                                                checked={
                                                    idealCollab?.indexOf(o.id) >
                                                    -1
                                                }
                                            />
                                            <ListItemText primary={o.text} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
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
