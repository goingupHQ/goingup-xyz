import React from 'react';
import { v4 as uuid } from 'uuid';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Button, Stack } from '@mui/material';
import ProjectLogo from './project-logo';

export default function SetProjectLogo(props) {
    const { projectId } = props;
    const fileInputRef = React.useRef(null);
    const logoRef = React.useRef(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const projectsContext = React.useContext(ProjectsContext);

    const [working, setWorking] = React.useState(false);

    const upload = async (e) => {
        setWorking(true);
        try {
            const file = e.target.files[0];
            // const filename = encodeURIComponent(file.name);
            const filename = uuid();
            const res = await fetch(`/api/upload-to-gcp?file=${filename}`);
            const { url, fields } = await res.json();
            const formData = new FormData();

            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                // @ts-ignore
                formData.append(key, value);
            });

            const upload = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (upload.ok) {
                const imageUrl = `${upload.url}${filename}`;

                const approveKey = enqueueSnackbar('Approve the transaction on your wallet to set your project photo', {
                    variant: 'info',
                    persist: true,
                });

                const tx = await projectsContext.setProjectLogo(projectId, imageUrl);
                closeSnackbar(approveKey);

                const awaitingKey = enqueueSnackbar('Set project logo transaction awaiting blockchain confirmation', {
                    variant: 'info',
                    persist: true,
                    action: (key) => (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                window.open(
                                    `${projectsContext.networkParams.blockExplorerUrls[0]}tx/${tx.hash}`,
                                    '_blank'
                                );
                            }}
                        >
                            Open Transaction
                        </Button>
                    ),
                });

                tx.wait().then(() => {
                    logoRef.current.reload();
                    closeSnackbar(awaitingKey);
                    enqueueSnackbar('Project logo set successfully', {
                        variant: 'success',
                    });
                });
            } else {
                throw 'Upload failed';
            }
        } catch (err) {
            closeSnackbar();
            if (typeof err === 'string') {
                enqueueSnackbar(err, { variant: 'error' });
            } else if (err?.message) {
                enqueueSnackbar(err.message, { variant: 'error' });
            } else {
                console.error(err);
                enqueueSnackbar('There was an error setting your project logo', { variant: 'error' });
            }
        } finally {
            setWorking(false);
        }
    };

    return (
        <>
            <input ref={fileInputRef} accept="image/*" type="file" style={{ display: 'none' }} onChange={upload} />
            <Stack direction="column" spacing={2} alignItems="flex-start">
                <ProjectLogo projectId={projectId} ref={logoRef} />
                <LoadingButton
                    variant="contained"
                    loading={working}
                    onClick={() => {
                        fileInputRef.current.click();
                    }}
                >
                    Set Project Logo
                </LoadingButton>
            </Stack>
        </>
    );
}
