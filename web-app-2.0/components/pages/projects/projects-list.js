import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import { AppContext } from "../../../contexts/app-context";
import {
  Box,
  Backdrop,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function ProjectsList(props) {
  const router = useRouter();
  const projectsContext = useContext(ProjectsContext);
  const app = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const account = useAccount();

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await projectsContext.getProjects());
    } catch (err) {
      enqueueSnackbar("There was an error loading your projects", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account.isConnected) load();
  }, [account.isConnected]);

  return (
    <>
      {!loading && (
        <>
          {projects.length === 0 ? (
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
                    <Link key={index} href={`/projects/${project.id}`}>
                      <Stack
                        p="15px"
                        backgroundColor={
                          app.mode === "dark" ? "#19222C" : "#FFFFFF"
                        }
                        sx={{
                          borderRadius: "8px",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        width="285px"
                        height="111px"
                        spacing={2}
                      >
                        <Typography
                          variant="h3"
                          color={app.mode === "dark" ? "#FFFFFF" : "#081724"}
                        >
                          {project.name}
                        </Typography>
                        <Stack item flexDirection="row">
                          {tags.slice(0, 3).map((tag, index) => (
                            <Stack
                              key={index}
                              item
                              flexDirection="row"
                              backgroundColor={
                                app.mode === "dark" ? "#253340" : "#F5F5F5"
                              }
                              sx={{
                                width: {
                                  xs: "100%",
                                  md: "60%",
                                  lg: "50%",
                                  xl: "40%",
                                },
                                borderRadius: "8px",
                              }}
                              justifyContent="center"
                              py={1}
                              m={"0.25rem"}
                            >
                              <Typography
                                sx={{
                                  fontFamily: "Gilroy",
                                  fontStyle: "normal",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  lineHeight: "12px",
                                }}
                                color={
                                  app.mode === "dark" ? "#FFFFFF" : "#081724"
                                }
                              >
                                {tag}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Stack>
                    </Link>
                  );
                })}
              </Stack>
            </Stack>
          )}
        </>
      )}

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
