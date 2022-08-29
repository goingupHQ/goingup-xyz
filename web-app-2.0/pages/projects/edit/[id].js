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
}
