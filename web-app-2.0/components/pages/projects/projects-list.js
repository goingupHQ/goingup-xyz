import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectCard from "./project-card";
import { useSnackbar } from "notistack";
import { WalletContext } from "../../../contexts/wallet-context";
import LoadingIllustration from "../../common/loading-illustration";

export default function ProjectsList(props) {
    const router = useRouter();
    const projectsContext = useContext(ProjectsContext);
    const wallet = useContext(WalletContext);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [joinedProjects, setJoinedProjects] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const load = async () => {
        setLoading(true);
        try {
            const ownedProjects = await projectsContext.getProjects();
            const joinedProjects = await projectsContext.getJoinedProjects(
                wallet.address
            );
            setProjects(ownedProjects);
            setJoinedProjects(joinedProjects);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("There was an error loading your projects", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //
        if (wallet.address) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.address]);

    return (
        <>
            {!loading && (
                <>
                    {projects.length === 0 && (
                        <Stack
                            justifyContent='center'
                            alignItems='center'
                            direction='column'
                            spacing={4}
                        >
                            <Typography variant='h2'>
                                You have not created a project yet
                            </Typography>

                            <img
                                src='/images/illustrations/empty-box.svg'
                                alt='connection-lost'
                                style={{ width: "100%", maxWidth: "500px" }}
                            />

                            <Button
                                variant='contained'
                                color='primary'
                                size='large'
                                onClick={() => router.push("/projects/create")}
                            >
                                Create your first Project
                            </Button>
                        </Stack>
                    )}
                    <Stack spacing={4}>
                        {projects.length > 0 && (
                            <Stack direction='column'>
                                <Typography margin={1} variant="h2">My Projects</Typography>
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ alignItems: "stretch" }}
                                >
                                    {projects.map((project) => (
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            lg={4}
                                            key={project.id}
                                        >
                                            <ProjectCard project={project} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        )}
                        {joinedProjects.length > 0 && (
                            <Stack direction='column'>
                                <Typography margin={1} variant="h2">Guest Projects</Typography>
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ alignItems: "stretch" }}
                                >
                                    {joinedProjects.map((project) => (
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            lg={4}
                                            key={project.id}
                                        >
                                            <ProjectCard project={project} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        )}
                    </Stack>
                </>
            )}
            {loading && (
                <Box sx={{ py: "60px" }}>
                    <LoadingIllustration />
                </Box>
            )}
        </>
    );
}
