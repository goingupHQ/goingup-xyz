import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../../../contexts/projects-context";
import { WalletContext } from "../../../contexts/wallet-context";
import { AppContext } from "../../../contexts/app-context";
import { useSnackbar } from "notistack";
import ProjectCard from "../projects/project-card";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Fade,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import ProjectSectionCard from "./project-section-card";
import { useRouter } from "next/router";

export default function ProjectsSection(props) {
    const { account } = props;
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const projectsContext = useContext(ProjectsContext);
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [joinedProjects, setJoinedProjects] = useState([]);
    const [projectOwner, setProjectOwner] = useState(false);
    const [projectContributor, setProjectContributor] = useState(false);
    const router = useRouter();
    const { address } = router.query;

    const handleClick = () => {
        setProjectOwner((current) => !current);
        setProjectContributor((current) => !current);
    };

    const load = async () => {
        setLoading(true);
        try {
            const ownedProjects = await projectsContext.getAccountProjects(address);
            const joinedProjects =
                await projectsContext.getAccountJoinedProjects(address);

                console.log("ownedProjects", ownedProjects);
                console.log("joinedProjects", joinedProjects);

            setProjects(ownedProjects);
            setJoinedProjects(joinedProjects);
        } catch (err) {
            console.error('Error loading projects', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account.address && router.isReady) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account.address, router.isReady]);

    useEffect(() => {
        setProjectOwner(true);
        setProjectContributor(false);
    }, [account.address]);

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "30px",
                        backgroundColor: {
                            xs: app.mode === "dark" ? "#0F151C" : "#FFFFFF",
                            md: app.mode === "dark" ? "#111921" : "#F5F5F5",
                        },
                    }}
                >
                    {!loading && (
                        <>
                            <Typography margin={4} variant='mobileh1'>
                                Projects
                            </Typography>

                            <Stack
                                direction='row'
                                paddingBottom={"14px"}
                                paddingX={"30px"}
                            >
                                {projectOwner ? (
                                    <Button variant='outlined' color='text'>
                                        Project Owner
                                    </Button>
                                ) : (
                                    <Button onClick={handleClick} color='text'>
                                        Project Owner
                                    </Button>
                                )}
                                {projectContributor ? (
                                    <Button variant='outlined' color='text'>
                                        Project Contributor
                                    </Button>
                                ) : (
                                    <Button onClick={handleClick} color='text'>
                                        Project Contributor
                                    </Button>
                                )}
                            </Stack>
                            <Stack
                                spacing={4}
                                paddingBottom={"30px"}
                                paddingX={"30px"}
                            >
                                {projects.length === 0 && projectOwner && (
                                    <Stack
                                        justifyContent='center'
                                        alignItems='center'
                                        direction='column'
                                        spacing={4}
                                    >
                                        <Typography variant='h2'>
                                            {account.name} have not created a project yet
                                        </Typography>

                                        <img
                                            src='/images/illustrations/empty-box.svg'
                                            alt='connection-lost'
                                            style={{
                                                width: "100%",
                                                maxWidth: "200px",
                                            }}
                                        />
                                    </Stack>
                                )}
                                {projects.length > 0 && projectOwner && (
                                    <Stack direction='column'>
                                        <Grid
                                            container
                                            spacing={3}
                                            sx={{ alignItems: "stretch" }}
                                        >
                                            {projects
                                                .slice(0, 3)
                                                .map((project, index) => (
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={6}
                                                        lg={4}
                                                        key={project.id._hex || index}
                                                    >
                                                        <ProjectSectionCard
                                                            project={project}
                                                        />
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    </Stack>
                                )}
                                {joinedProjects.length === 0 && projectContributor && (
                                    <Stack
                                        justifyContent='center'
                                        alignItems='center'
                                        direction='column'
                                        spacing={4}
                                    >
                                        <Typography variant='h2'>
                                            {account.name} have not contributed to a project yet
                                        </Typography>

                                        <img
                                            src='/images/illustrations/empty-box.svg'
                                            alt='connection-lost'
                                            style={{
                                                width: "100%",
                                                maxWidth: "200px",
                                            }}
                                        />
                                    </Stack>
                                )}
                                {joinedProjects.length > 0 &&
                                    projectContributor && (
                                        <Stack direction='column'>
                                            <Grid
                                                container
                                                spacing={3}
                                                sx={{ alignItems: "stretch" }}
                                            >
                                                {joinedProjects
                                                    .slice(0, 3)
                                                    .map((project, index) => (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={6}
                                                            lg={4}
                                                            key={project.id._hex || index}
                                                        >
                                                            <ProjectSectionCard
                                                                project={
                                                                    project
                                                                }
                                                            />
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        </Stack>
                                    )}
                            </Stack>
                        </>
                    )}
                    {loading && (
                        <Box padding={'30px'}>
                            <CircularProgress />
                        </Box>
                    )}
                </Card>
            </Fade>
        </>
    );
}
