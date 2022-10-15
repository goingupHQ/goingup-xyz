import {
    Button,
    Checkbox,
    Grid,
    Typography,
    Stack,
    TextField,
    Autocomplete,
    Chip,
    FormControlLabel,
    Backdrop,
    CircularProgress,
    Paper,
    IconButton,
    Box,
    LinearProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import { AppContext } from '../../../contexts/app-context';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import moment from 'moment';
import { isURL } from 'validator';
import { WalletContext } from '../../../contexts/wallet-context';
import { v4 as uuid } from 'uuid';

export default function ProjectForm(props) {
    const projectsContext = useContext(ProjectsContext);
    const wallet = useContext(WalletContext);
    const router = useRouter();
    const { projectData } = props;

    const isCreate = router.pathname === '/projects/create';

    const [form, setForm] = useState({
        name: '',
        description: '',
        started: null,
        ended: null,
        primaryUrl: '',
            tags: [],
            isPrivate: false,
        projectImage: null,
    });

    const [oldForm, setOldForm] = useState({
        name: '',
        description: '',
        started: null,
        ended: null,
        primaryUrl: '',
        tags: [],
        isPrivate: false,
        projectImage: null,
    });

    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        //
        if (projectData) {
            setForm({
                ...form,
                name: projectData.name,
                description: projectData.description,
                started: projectData.started.toNumber() !== 0 ? new Date(projectData.started.toNumber() * 1000) : null,
                ended: projectData.ended.toNumber() !== 0 ? new Date(projectData.ended.toNumber() * 1000) : null,
                primaryUrl: projectData.primaryUrl,
                tags: projectData.tags ? projectData.tags.split(',').map((tag) => tag.trim()) : [],
                isPrivate: projectData.isPrivate,
            });

            setOldForm({
                ...oldForm,
                name: projectData.name,
                description: projectData.description,
                started: projectData.started.toNumber() !== 0 ? new Date(projectData.started.toNumber() * 1000) : null,
                ended: projectData.ended.toNumber() !== 0 ? new Date(projectData.ended.toNumber() * 1000) : null,
                primaryUrl: projectData.primaryUrl,
                tags: projectData.tags ? projectData.tags.split(',').map((tag) => tag.trim()) : [],
                isPrivate: projectData.isPrivate,
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectData]);

    const [saving, setSaving] = useState(false);
    const sendProject = async () => {
        closeSnackbar();

        try {
            if (!form.name) throw 'Project name is required';
            if (!form.description) throw 'Project description is required';
            if (form.primaryUrl && !isURL(form.primaryUrl)) throw 'Project primary URL is invalid';
            if (!projectsContext.isCorrectNetwork) throw 'You are not on the correct network';

            enqueueSnackbar('Creating transaction, please approve on your wallet', {
                variant: 'info',
                persist: true,
            });

            if (isCreate) {
                const currentBlock = await wallet.ethersProvider.getBlockNumber();

                const createTx = await projectsContext.createProject(
                    form.name,
                    form.description,
                    form.started,
                    form.ended,
                    form.primaryUrl,
                    form.tags,
                    form.isPrivate,
                    form.projectImage
                );

                closeSnackbar();
                setSaving(true);

                enqueueSnackbar('Waiting for transaction confirmations', {
                    variant: 'info',
                    persist: true,
                    action: (key) => {
                        return (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    const baseUrl = projectsContext.networkParams.blockExplorers[0];
                                    window.open(`${baseUrl}tx/${createTx.hash}`);
                                }}
                            >
                                Open Transaction
                            </Button>
                        );
                    },
                });
                await createTx.wait();

                const projectsAfterBlock = await projectsContext.getProjectsAfterBlock(currentBlock);
                const createdProject = projectsAfterBlock.slice(-1)[0];

                closeSnackbar();

                enqueueSnackbar('Project created', { variant: 'success' });
                router.push(`/projects/page/${createdProject.id.toNumber()}`);
            } else {
                const updateTx = await projectsContext.updateProject(
                    projectData.id,
                    form.name,
                    form.description,
                    form.started,
                    form.ended,
                    form.primaryUrl,
                    form.tags,
                    form.isPrivate,
                    form.projectImage
                );

                closeSnackbar();
                setSaving(true);

                enqueueSnackbar('Waiting for transaction confirmations', {
                    variant: 'info',
                    persist: true,
                    action: (key) => {
                        <Button
                            onClick={() => {
                                const baseUrl = projectsContext.networkParams.blockExplorers[0];
                                window.open(`${baseUrl}tx/${createTx.hash}`);
                            }}
                        >
                            Show Transaction
                        </Button>;
                    },
                });
                await updateTx.wait();
                closeSnackbar();

                enqueueSnackbar('Project updated', { variant: 'success' });
                router.push(`/projects/page/${projectData.id}`);
            }
        } catch (e) {
            closeSnackbar();
            if (typeof e === 'string') {
                enqueueSnackbar(e, { variant: 'error' });
            } else {
                enqueueSnackbar(e.message || `Sorry something went wrong`, {
                    variant: 'error',
                });
            }
            console.log(e);
            setSaving(false);
        }
    };

    return (
        <>
            {!saving && (
                <Stack spacing={1} sx={{ width: { xs: '100%', md: '60%', lg: '50%', xl: '40%' } }}>
                    <Typography variant="h1" sx={{ paddingLeft: 2 }}>
                        {isCreate ? 'Create Project' : `Edit ${form.name || 'Project'}`}
                    </Typography>

                    <Paper sx={{ padding: 2 }}>
                        <Grid container columnSpacing={2} rowSpacing={2} sx={{ padding: 0 }}>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    id="outlined-basic"
                                    label="Project Name"
                                    variant="outlined"
                                    value={form.name}
                                    fullWidth
                                    autoComplete="off"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                                    onChange={(e) => setForm({ ...form, started: e })}
                                    renderInput={(params) => <TextField {...params} autoComplete="off" fullWidth />}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DesktopDatePicker
                                    label="Ended"
                                    inputFormat="MM/DD/yyyy"
                                    value={form.ended}
                                    onChange={(e) => setForm({ ...form, ended: e })}
                                    renderInput={(params) => <TextField {...params} autoComplete="off" fullWidth />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    onChange={(e) => setForm({ ...form, primaryUrl: e.target.value })}
                                    value={form.primaryUrl}
                                    id="outlined-basic"
                                    label="Primary URL"
                                    variant="outlined"
                                    placeholder="https://www.project.com"
                                    fullWidth
                                    autoComplete="off"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    value={form.tags?.length === 0 ? [] : form.tags}
                                    options={[]}
                                    onChange={(e, value) => {
                                        setForm({ ...form, tags: value });
                                    }}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={index}
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => <TextField {...params} variant="outlined" label="Tags" />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="Is this a private project?"
                                    control={
                                        <Checkbox
                                            checked={form.isPrivate}
                                            onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LoadingButton variant="contained" onClick={() => sendProject()}>
                                    {isCreate ? 'Create Project' : 'Update Project'}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Stack>
            )}

            {saving && (
                <Stack spacing={5} sx={{ width: '100%', padding: 2 }} justifyContent="center" alignItems="center">
                    <Typography variant="h2">Transaction submitted and waiting for blockchain confirmations</Typography>
                    <Box
                        component="img"
                        src="/images/illustrations/waiting-for-block-confirmations.svg"
                        alt="Processing"
                        sx={{ width: '100%', maxWidth: '500px' }}
                    />
                    <Box sx={{ width: '100%', maxWidth: '500px' }}>
                        <LinearProgress variant="indeterminate" />
                    </Box>
                </Stack>
            )}

            <Backdrop open={loading} sx={{ opacity: 1, zIndex: 1200 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}
