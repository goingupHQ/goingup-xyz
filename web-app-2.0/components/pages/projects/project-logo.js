import { Box, Paper } from '@mui/material';
import React from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';

const ProjectLogo = (props, ref) => {
    const { projectId } = props;
    const [logoUrl, setLogoUrl] = React.useState(null);
    const height = props.height || 128;
    const width = props.width || 128;

    const projectsContext = React.useContext(ProjectsContext);

    React.useImperativeHandle(ref, () => ({
        reload() {
            load();
        },
        hasLogo() {
            return !!logoUrl;
        },
    }));

    const load = async () => {
        if (!projectId) return;

        try {
            const result = await projectsContext.getProjectLogo(projectId);
            setLogoUrl(result);
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        //
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    return (
        <>
            {logoUrl && (
                <Paper
                    sx={{
                        width,
                        height,
                        backgroundImage: `url(${logoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
        </>
    );
};

export default React.forwardRef(ProjectLogo);
