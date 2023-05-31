import { useContext, useEffect, useState } from 'react';
import { ProjectsContext } from '../../../contexts/projects-context';
import { Box, Grid, Stack, Typography } from '@mui/material';
import ProjectCard from './project-card';
import { useSnackbar } from 'notistack';
import { WalletContext } from '../../../contexts/wallet-context';
import LoadingIllustration from '../../common/loading-illustration';
import NoSSR from 'react-no-ssr';

export default function ProjectsList(props) {
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
      setProjects(ownedProjects);

      try {
        const joinedProjects = await projectsContext.getJoinedProjects(wallet.address);
        setJoinedProjects(joinedProjects);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('We could not load projects you are a member of', {
          variant: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('There was an error loading your projects', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(wallet.address);
    if (wallet.address) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.address]);

  return (
    <NoSSR>
      {!loading && (
        <>
          {projects.length + joinedProjects.length === 0 && (
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="column"
              spacing={4}
            >
              <Typography variant="h2">You have not created a project yet</Typography>
              <img
                src="/images/illustrations/empty-box.svg"
                alt="connection-lost"
                style={{ width: '100%', maxWidth: '500px' }}
              />
            </Stack>
          )}
          <Stack spacing={4}>
            {projects.length > 0 && (
              <Stack direction="column">
                <Typography
                  margin={1}
                  variant="h2"
                >
                  My Projects
                </Typography>
                <Grid
                  container
                  spacing={3}
                  sx={{ alignItems: 'stretch' }}
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
              <Stack direction="column">
                <Typography
                  margin={1}
                  variant="h2"
                >
                  Guest Projects
                </Typography>
                <Grid
                  container
                  spacing={3}
                  sx={{ alignItems: 'stretch' }}
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
        <Box sx={{ py: '60px' }}>
          <LoadingIllustration />
        </Box>
      )}
    </NoSSR>
  );
}
