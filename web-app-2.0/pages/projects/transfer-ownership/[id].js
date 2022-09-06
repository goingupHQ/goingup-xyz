import { Backdrop, Button, Chip, CircularProgress, Fade, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Box } from '@mui/system';
import Head from 'next/head';
import moment from 'moment';
import AccountNameAddress from '../../../components/common/account-name-address';
import AddressInput from '../../../components/common/address-input';
import { useSnackbar } from 'notistack';
import { WalletContext } from '../../../contexts/wallet-context';
import SectionHeader from '../../../components/common/section-header';

export default function TransferOwnership(props) {
    const router = useRouter();
    const { id } = router.query;
    const projectsContext = React.useContext(ProjectsContext);
    const wallet = React.useContext(WalletContext);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loading, setLoading] = React.useState(true);
    const [project, setProject] = React.useState(null);
    const [newOwner, setNewOwner] = React.useState(null);
    const [transferring, setTransferring] = React.useState(false);

    React.useEffect(() => {
        if (router.isReady && wallet.address) {
            setLoading(true);
            projectsContext
                .getProject(id)
                .then((project) => {
                    console.log(project);
                    setProject(project);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, wallet.address, router.isReady]);

    const handleTransferOwnership = async () => {
        closeSnackbar();
        setTransferring(true);
        try {
            enqueueSnackbar('Creating transaction, please approve on your wallet', {
                variant: 'info',
                persist: true,
            });

            const tx = await projectsContext.transferProjectOwnership(id, newOwner);
            enqueueSnackbar('Waiting for transaction confirmations', {
                variant: 'info',
                persist: true,
                action: (key) => {
                    <Button
                        onClick={() => {
                            const baseUrl = projectsCtx.networkParams.blockExplorers[0];
                            window.open(`${baseUrl}tx/${createTx.hash}`);
                        }}
                    >
                        Show Transaction
                    </Button>;
                },
            });
            await tx.wait();

            enqueueSnackbar(`Project ${project?.name} ownership successfully transferred`, { variant: 'success' });
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
        } finally {
            setTransferring(false);
        }
    };

    return (
        <>
            <Head>
                <title>
                    Transfer Ownership of Project: {project === null ? 'GoingUP Project' : `${project?.name} `}
                </title>
            </Head>
            <Grid container sx={{ mb: 3 }} rowSpacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1">
                        {project === null
                            ? 'Loading Transfer Project Ownership...'
                            : `Transfer Ownership of Project: ${project.name}`}
                    </Typography>
                </Grid>
            </Grid>

            <Fade in={!loading}>
                <Paper sx={{ padding: 3 }}>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <SectionHeader title="Project Details">
                            <NextLink href={`/projects/page/${id}`} passHref>
                                        <Button variant="contained" color="secondary" size="large">
                                            Go Back to Project Page
                                        </Button>
                                    </NextLink>
                            </SectionHeader>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="GrayText">
                                Description
                            </Typography>
                            <Typography variant="body1">{project?.description}</Typography>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Typography variant="body1" color="GrayText">
                                Started
                            </Typography>
                            <Typography variant="body1">
                                {project?.started?.toNumber()
                                    ? moment(project?.started.toNumber() * 1000).format('LL')
                                    : 'None'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7}>
                            <Typography variant="body1" color="GrayText">
                                Ended
                            </Typography>
                            <Typography variant="body1">
                                {project?.ended?.toNumber()
                                    ? moment(project?.ended.toNumber() * 1000).format('LL')
                                    : 'None'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Typography variant="body1" color="GrayText">
                                Project URL
                            </Typography>
                            <Link href={project?.primaryUrl} target="_blank">
                                <Typography variant="body1" sx={{ textDecoration: 'underline' }}>
                                    {project?.primaryUrl}
                                </Typography>
                            </Link>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Typography variant="body1" color="GrayText">
                                Tags
                            </Typography>
                            {project?.tags?.split(',').map((tag, index) => (
                                <Chip key={index} label={tag.trim()} sx={{ mr: '2px' }} />
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="GrayText">
                                Current Project Owner
                            </Typography>

                            <Typography variant="body1">
                                <AccountNameAddress address={project?.owner} />
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <AddressInput
                                label="New Project Owner Address"
                                variant="contained"
                                sx={{ width: { xs: '100%', md: '500px' } }}
                                value={newOwner}
                                onChange={(e) => setNewOwner(e.target.value)}
                                setValue={setNewOwner}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" size="large" onClick={handleTransferOwnership}>
                                Transfer Ownership
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>

            <Backdrop open={loading || transferring} sx={{ zIndex: 1200 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}
