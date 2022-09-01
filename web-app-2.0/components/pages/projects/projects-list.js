import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import {
  Backdrop,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAccount } from "wagmi";
import ProjectCard from "../../common/project-card";

export default function ProjectsList(props) {
  const router = useRouter();
  const projectsContext = useContext(ProjectsContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(undefined);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const account = useAccount();

  const load = async () => {
    setLoading(true);
    try {
      if (account.address) {
        const projects = await projectsContext.getProjects(account?.address);
        setProjects(projects);
      }
    } catch (err) {
      enqueueSnackbar("There was an error loading your projects", {
        variant: "error",
      });
    } finally {
     setLoading(false)
    }
  };

  useEffect(() => {
    if (account.isConnected && loading) {
      load();
    }
  }, [account.isConnected, loading]);


  return (
    <>
      {!loading && (
        <>
          {!loading && projects.length === 0 ? (
            <Stack
              mt={5}
              justifyContent="center"
              alignItems="center"
              direction="column"
              spacing={4}
            >
              <Typography variant="h2">
                You have not created a project yet
              </Typography>

              <img
                src="/images/illustrations/empty-box.svg"
                alt="connection-lost"
                style={{ width: "100%", maxWidth: "500px" }}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/projects/create")}
              >
                Create your first Project
              </Button>
            </Stack>
          ) : (
            <Stack mt={5} mx={3} alignItems="start" direction="column">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/projects/create")}
              >
                + Create Another Project
              </Button>
              <Stack
                mt={5}
                px={3}
                alignItems="start"
                direction="row"
                spacing={4}
              >
                {projects.map((project, index) => {
                  const tags = project.tags.split(", ");
                  return (
                    <ProjectCard 
                      link={`/projects/${project.id}`}
                      name={project.name}
                      topText={"DEFI"}
                      tags={tags}
                      key={index}
                    />
                  );
                })}
              </Stack>
            </Stack>
          )}
        </>
      )}

      <Backdrop open={loading || projects === []}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
