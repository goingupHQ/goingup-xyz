<<<<<<< HEAD
import Head from "next/head";
import React, { useState, useContext, useEffect } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import ProjectForm from "../../../components/pages/projects/form";
import { useRouter } from "next/router";

export default function EditProject() {
  const projectsCtx = useContext(ProjectsContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getProject = async () => {
    if (router.query.id) {
        setData(await projectsCtx.getProject(router?.query?.id));
        setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) {
      getProject();
    }
  }, [data, projectsCtx]);

  return (
    <>
      <Head>
        <title>Going UP - Edit A Project</title>
      </Head>

      <ProjectForm projectData={data} />
    </>
  );
=======
import Head from 'next/head';
import React, { useState, useContext, useEffect } from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import ProjectForm from '../../../components/pages/projects/project-form';
import { useRouter } from 'next/router';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function EditProject() {
    const projectsCtx = useContext(ProjectsContext);
    const [data, setData] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const getProject = async () => {
        setLoading(true);
        try {
            setData(await projectsCtx.getProject(router.query.id));
        } catch (err) {
            enqueueSnackbar('There was an error loading your project', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady) {
            getProject();
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Going UP - Edit A Project</title>
            </Head>

            <ProjectForm projectData={data} />

            <Backdrop open={loading} sx={{ zIndex: 1200 }}>
                <CircularProgress />
            </Backdrop>
        </>
    );
>>>>>>> mark
}
