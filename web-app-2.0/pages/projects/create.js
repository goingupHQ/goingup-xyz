import Head from 'next/head';
import React, { useState, useContext } from 'react';
import { ProjectsContext } from '../../contexts/projects-context';
import { ProjectForm } from '../../components/pages/projects/form';

export default function CreateProject(props) {
    const projectsCtx = useContext(ProjectsContext);

  

    return (
        <>
            <Head>
                <title>Going UP - Create A Project</title>
            </Head>

            
            <ProjectForm 
    projectData={null}
            />
        </>
    );
}
