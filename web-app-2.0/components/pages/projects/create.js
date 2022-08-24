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
import { ProjectsContext } from '../../contexts/projects-context';
import { AppContext } from '../../contexts/app-context';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

export default function CreateProject(props) {
    const app = useContext(AppContext);
    const projectsCtx = useContext(ProjectsContext);

    // const [name, setName] = useState('');
    // const [description, setDescription] = useState('');
    // const [started, setStarted] = useState(null);
    // const [ended, setEnded] = useState(null);
    // const [primaryUrl, setPrimaryUrl] = useState('');
    // const [tags, setTags] = useState([]);
    // const [isPrivate, setIsPrivate] = useState('');

    const [form, setForm] = useState({
        name: '',
        description: '',
        started: null,
        ended: null,
        primaryUrl: '',
        tags: [],
        isPrivate: false,
    })

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
                form
            );
            console.log(form)

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
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            id="outlined-basic"
                            label="Project Name"
                            variant="outlined"
                            value={form.name}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setForm({...form, description: e.target.value})}
                            value={form.description}
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
                            value={form.started}
                            onChange={(e) => setForm({...form, started: e})}
                            renderInput={(params) => <TextField {...params} autoComplete={false} fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                            label="Ended"
                            inputFormat="MM/DD/yyyy"
                            value={form.ended}
                            onChange={(e) => setForm({...form, ended: e})}
                            renderInput={(params) => <TextField {...params} autoComplete={false} fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setForm({...form, primaryUrl: e.target.value})}
                            value={form.primaryUrl}
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
                            onChange={(e, value) => {setForm({...form, tags: value}), console.log(value)}}
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
                            control={<Checkbox checked={form.isPrivate} onChange={(e) => setForm({...form, isPrivate: e.target.checked})} />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <LoadingButton variant="contained" onClick={() => createProject()}>
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