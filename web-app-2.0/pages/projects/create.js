import {
    Alert,
    Box,
    Button,
    Checkbox,
    Grid,
    Typography,
    Stack,
    Snackbar,
    TextField,
    Modal,
    Autocomplete,
    Chip,
    FormControlLabel,
    Backdrop,
    CircularProgress,
    Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import React, { useState, useContext } from 'react';
import { useContract, useSigner } from 'wagmi';
import { mumbaiAddress, projectsAbi, ProjectsContext } from '../../contexts/projects-context';
import { AppContext } from '../../contexts/app-context';
import DatePicker from '../../components/ui/datepicker';
import { BigNumber } from 'ethers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

export default function CreateProject(props) {
    const app = useContext(AppContext);
    const projectsCtx = useContext(ProjectsContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [started, setStarted] = useState(null);
    const [ended, setEnded] = useState(null);
    const [primaryUrl, setPrimaryUrl] = useState('');
    const [tags, setTags] = useState([]);
    const [isPrivate, setIsPrivate] = useState('');

    const [creating, setCreating] = useState(false);
    const [tx, setTx] = useState(null);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    const createProject = async () => {
        closeSnackbar();
        setTx(null);
        setCreating(true);

        try {
            enqueueSnackbar('Creating transactions, please approve on your wallet', { variant: 'info', persist: true });
            const createTx = await projectsCtx.createProject(
                name,
                description,
                started,
                ended,
                primaryUrl,
                tags,
                isPrivate
            );
            closeSnackbar();

            enqueueSnackbar('Waiting for transaction confirmations', {
                variant: 'info',
                persist: true,
                action: (key) => {
                    <Button onClick={() =>
                    {
                        const baseUrl = projectsCtx.networkParams.blockExplorers[0];
                        window.open(`${baseUrl}tx/${createTx.hash}`);
                    }}>
                        Show Transaction
                    </Button>
                },
            });
            setTx(createTx);
            await createTx.wait();
            closeSnackbar();

            enqueueSnackbar('Project created', { variant: 'success' });
            router.push('/projects');
        } catch (e) {
            closeSnackbar();
            if (typeof e === 'string') {
                enqueueSnackbar(e, { variant: 'error' });
            } else {
                enqueueSnackbar(e.message || `Sorry something went wrong`, { variant: 'error' });
            }
        } finally {
            setTx(null);
            setCreating(false);
        }
    };

    return (
        <>
            <Head>
                <title>Going UP - Create A Project</title>
            </Head>

            <Stack spacing={1} sx={{ width: { xs: '100%', md: '60%', lg: '50%', xl: '40%' } }}>
                <Typography variant="h1" sx={{ paddingLeft: 2 }}>
                    Create A Project
                </Typography>

                <Grid container columnSpacing={2} rowSpacing={2} sx={{ padding: 0 }}>
                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            id="outlined-basic"
                            label="Project Name"
                            variant="outlined"
                            value={name}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            id="outlined-basic"
                            label="Project Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            placeholder="This project is about..."
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                            label="Started"
                            inputFormat="MM/DD/yyyy"
                            value={started}
                            onChange={(newValue) => setStarted(newValue)}
                            renderInput={(params) => <TextField {...params} autoComplete={false} fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                            label="Ended"
                            inputFormat="MM/DD/yyyy"
                            value={ended}
                            onChange={(newValue) => setEnded(newValue)}
                            renderInput={(params) => <TextField {...params} autoComplete={false} fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setPrimaryUrl(e.target.value)}
                            value={primaryUrl}
                            id="outlined-basic"
                            label="Primary URL"
                            variant="outlined"
                            placeholder="https://www.project.com"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            // id="tags-filled"
                            options={[]}
                            // defaultValue={[top100Films[13].title]}
                            onChange={(e, value) => setTags(value)}
                            freeSolo
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => <TextField {...params} variant="outlined" label="Tags" />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            label="Is this a private project?"
                            control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <LoadingButton variant="contained" onClick={createProject}>
                            Create Project
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Stack>

            <Backdrop open={creating} sx={{ opacity: 1 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}
