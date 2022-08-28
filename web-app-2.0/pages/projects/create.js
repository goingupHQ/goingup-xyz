import Head from "next/head";
import React, { useContext } from "react";
import ProjectForm from "../../components/pages/projects/form";

export default function CreateProject(props) {
  return (
    <>
      <Head>
        <title>Going UP - Create A Project</title>
      </Head>

      <ProjectForm projectData={null} />
    </>
  );
}
