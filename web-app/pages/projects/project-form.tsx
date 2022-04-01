import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
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

const ProjectForm = (props, ref) => {
    const { projects, setProjects } = props;
    const [mode, setMode] = useState('create');
    const [project, setProject] = useState(null);
    const [open, setOpen] = useState(false);

    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completion, setCompletion] = useState(null);
    const [skills, setSkills] = useState([]);
    const [projectUrl, setProjectUrl] = useState('');

    const [saving, setSaving] = useState(false);

    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();

    useImperativeHandle(ref, () => ({
        show(mode, project) {
            setMode(mode);

            if (mode === 'update') {
                setId(project.id);
                setTitle(project.title);
                setDescription(project.description);
                setCompletion(project.completion);
                setSkills(project.skills);
                setProjectUrl(project.projectUrl);
            }
            if (mode === 'create') {
                setId(0);
                setTitle('');
                setDescription('');
                setCompletion(null);
                setSkills([]);
                setProjectUrl('');
            }
            setOpen(true);
        }
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const fieldStyle = {
        m: 1
    };

    const saveChanges = async () => {
        if (!title) {
            enqueueSnackbar('Project title is required', { variant: 'error' });
            return;
        }

        if (!description) {
            enqueueSnackbar('Project description is required', { variant: 'error' });
            return;
        }

        setSaving(true);

        try {
            const { address, ethersSigner } = wallet;
            const message = 'save-project';
            const signature = await ethersSigner.signMessage(message);

            const response = await fetch('/api/save-project/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    signature,
                    project: {
                        id,
                        title,
                        description,
                        completion,
                        skills,
                        projectUrl
                    }
                })
            });

            if (response.status === 200) {
                enqueueSnackbar('Project saved', {
                    variant: 'success'
                });
                if (props.loadProjects) props.loadProjects();
                setOpen(false);
            } else if (response.status >= 400) {
                enqueueSnackbar('Failed to save project', {
                    variant: 'error'
                });
            }
        } catch (err) {
            enqueueSnackbar('Failed to save profile changes', {
                variant: 'error'
            });
            console.log(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {mode === 'create' && `Add Project`}
                    {mode === 'update' && `Edit Project`}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'autofill',
                                md: 'repeat(1, 1fr)'
                            }
                        }}
                    >
                        <TextField
                            label="Project Title"
                            placeholder="Project #1"
                            variant="outlined"
                            required
                            sx={fieldStyle}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            multiline
                            rows={4}
                            label="Project Description"
                            variant="outlined"
                            required
                            sx={fieldStyle}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <DesktopDatePicker
                            label="Completion"
                            // inputFormat="MM/dd/yyyy"
                            value={completion}
                            onChange={(value) => setCompletion(value)}
                            renderInput={(params) => (
                                <TextField {...params} sx={fieldStyle} />
                            )}
                        />

                        <TextField
                            label="Project URL"
                            placeholder="https://project.io/"
                            variant="outlined"
                            sx={fieldStyle}
                            value={projectUrl}
                            onChange={(e) => setProjectUrl(e.target.value)}
                        />

                        <Autocomplete
                            multiple
                            options={[]}
                            value={skills}
                            // @ts-ignore
                            onChange={(event, value) => {
                                setSkills(value)
                            }}
                            freeSolo
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Skills & Deliverables"
                                />
                            )}
                            sx={{
                                m: 1
                            }}
                        />
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
        </>
    );
};

export default forwardRef(ProjectForm);
