import React, { useContext } from 'react'
import { ProjectsContext } from '../../../contexts/projects-context';
import { Backdrop } from '@mui/material';

export default function ProjectsList(props) {
    const projects = useContext(ProjectsContext);
    const [loading, setLoading] = React.useState(true);


    return (
        <>
            <Backdrop open={loading} />
        </>
    )
}
