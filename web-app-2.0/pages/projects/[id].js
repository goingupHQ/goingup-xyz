import { useEffect, useState, useContext } from "react";

import {
  Box,
  Grid,
  Typography,
  Stack,
  TextField,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";

import { useRouter } from "next/router";
import { ProjectsContext } from "../../contexts/projects-context";
import Link from "next/link";

export default function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pContext = useContext(ProjectsContext);

  const getProject = async () => {
    if (!project) {
      setProject(await pContext.getProject(router.query.id));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, [router, project]);

  console.log(project);

  return (
    <>
      <Stack
        mt="4rem"
        spacing={1}
        sx={{ width: { xs: "100%", md: "60%", lg: "50%", xl: "40%" } }}
      >        <Link href={`/projects/edit/${router.query.id}`}>
          <Button>Edit Project</Button>
        </Link>
      </Stack>

      <Backdrop open={loading} sx={{ opacity: 1 }}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
