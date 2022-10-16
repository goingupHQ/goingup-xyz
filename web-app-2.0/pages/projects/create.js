import Head from 'next/head';
import React, { useContext } from 'react';
import ProjectForm from '../../components/pages/projects/project-form';
import WrongNetwork from '../../components/pages/projects/wrong-network';
import { ProjectsContext } from '../../contexts/projects-context';

export default function CreateProject(props) {
    const projectsContext = useContext(ProjectsContext);
    return (
        <>
            <Head>
                <title>Going UP - Create A Project</title>
            </Head>

            {!projectsContext.isCorrectNetwork && <WrongNetwork />}

            {projectsContext.isCorrectNetwork && <ProjectForm projectData={null} />}
        </>
    );
}
