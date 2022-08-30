import { useEffect, useState, useContext } from "react";

import {
  Box,
  Typography,
  Stack,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";

import { useRouter } from "next/router";
import {useAccount, useEnsName} from "wagmi";
import { ProjectsContext } from "../../contexts/projects-context";
import Link from "next/link";
import Head from "next/head";
import { trim } from "../../components/utils";

export default function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const account = useAccount();
  const { data, isError, isLoading } = useEnsName({
    address: account?.address.toString()
  });

  console.log(data)

  const router = useRouter();
  const pContext = useContext(ProjectsContext);

  const getProject = async () => {
    if (!project && router.query.id) {
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
      <Head>
        <title>Going UP - Project</title>
      </Head>
      <Stack
        sx={{ width: { xs: "100%", md: "80%", lg: "70%", xl: "60%" }}}
        alignItems="center"
        m="auto"
      >
        <Stack mt="4rem" spacing={1} alignSelf="end">
          {" "}
          <Link href={`/projects/edit/${router.query.id}`}>
            <Button variant="outlined" color="primary" size="medium">
              Edit Project
            </Button>
          </Link>
        </Stack>

        <Stack
          borderRadius={1.5}
          sx={{ backgroundColor: "#111921", borderRadius: "12px" }}
          width="100%"
          p={4}
          my={2}
          direction="column"
          spacing={6}
        >
          <Stack justifyContent="space-between" direction="row" sx={{width: "100%"}}>

            <Stack alignItems="center" justifyContent="space-between" direction="row" spacing={4}>
            <Box
              component="img"
              sx={{
                height: "120px",
                width: "120px",
                borderRadius: "8px"
              }}
              alt="Project owner."
              src="https://cdn.sanity.io/images/c1chvb1i/production/ff6990752f0e4eb347cd4ca5e51e85dedfa19851-626x329.jpg?rect=94,0,438,329&w=626&h=470"
            />
              <Typography
                variant="h4
              "
                color="white"
                sx={{
                  fontFamily: "Gilroy",
                  fontStyle: "normal",
                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "95%",
                }}
              >
                {project ? project?.name : "Project Name"}
              </Typography>
            </Stack>

            <Stack>
              <Stack
                height={4}
                width="320px"
                direction="row"
                sx={{ spacing: "0px", height:"28px" }}
              >
                <Stack
                  sx={{
                    backgroundColor: "#111921",
                    borderLeftRadius: "12px",
                    border: "2px solid #253340",
                    width: "50%",
                    py: "2px",
                  }}
                >
                  <Typography textAlign="center" fontSize="14px">
                    owner.eth
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    backgroundColor: "#253340",
                    borderRightRadius: "12px",
                    width: "50%",
                    py: "4px"
                  }}
                >
                  <Typography
                    textAlign="center"
                    fontSize="14px"
                    variant="h6"
                    color="white"
                    sx={{ fontFamily: "Gilroy", fontWeight: "600" }}
                  >
                    {project ? trim(project.owner, 6, 4) : "..."}
                  </Typography>
                </Stack>
              </Stack>

            </Stack>
          </Stack>

            <Stack justifyContent="space-between" direction="row" sx={{width: "100%"}}>
              <Typography>{project ? project?.description : "Project description"}</Typography>
            </Stack>
        </Stack>
      </Stack>

      <Backdrop open={loading} sx={{ opacity: 1 }}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
