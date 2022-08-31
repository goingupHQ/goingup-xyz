import { useEffect, useState, useContext } from "react";

import {
  Box,
  Typography,
  Stack,
  Backdrop,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";

import { useRouter } from "next/router";
import { useAccount, useEnsName } from "wagmi";
import { ProjectsContext } from "../../contexts/projects-context";
import Link from "next/link";
import Head from "next/head";

import TeamMember from "../../components/pages/projects/team-member";
import AddressBar from "../../components/common/addressBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const account = useAccount();

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

  return (
    <>
      <Head>
        <title>Going UP - Project</title>
      </Head>
      <Stack onClick={() => router.back()}  position="absolute" pt={6} px={6} justifyContent="center">
        <ArrowBackIcon sx={{ ':hover': {
                    cursor: "pointer",
                }, color: "#4D5F72" }} />
      </Stack>

      <Stack
        sx={{ width: { xs: "100%", md: "80%", lg: "70%", xl: "60%" } }}
        alignItems="center"
        m="auto"
        pt={4}
      >
        {project?.owner === account?.address && (
          <Stack spacing={1} alignSelf="end">
            {" "}
            <Link href={`/projects/edit/${router.query.id}`}>
              <Button variant="outlined" color="primary" size="medium">
                Edit Project
              </Button>
            </Link>
          </Stack>
        )}

        <Stack
          borderRadius={1.5}
          sx={{ backgroundColor: "#111921", borderRadius: "12px" }}
          width="100%"
          p={4}
          my={2}
          direction="column"
          spacing={5}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            sx={{ width: "100%" }}
          >
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
              spacing={4}
            >
              <Box
                component="img"
                sx={{
                  height: "120px",
                  width: "120px",
                  borderRadius: "8px",
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
              <AddressBar
                ethName={"owner.eth"}
                address={
                  project
                    ? project.owner
                    : "0x0000000000000000000000000000000000000000"
                }
              />
            </Stack>
          </Stack>

          <Stack
            justifyContent="space-between"
            direction="row"
            sx={{ width: "100%" }}
          >
            <Typography
              textAlign="justify"
              fontSize="14px"
              color="white"
              sx={{
                fontFamily: "Gilroy",
                fontWeight: "500",
                lineHeight: "24px",
              }}
            >
              {project ? project?.description : "Project description"}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          width="100%"
          my={2}
          direction="column"
          pb={2}
          sx={{ backgroundColor: "#111921", borderRadius: "0px 0px 12px 12px" }}
        >
          <Stack
            px={4}
            pt={4}
            pb={2}
            sx={{
              backgroundColor: "#111921",
              borderRadius: "12px 12px 0px 0px",
            }}
          >
            <Typography variant="h1">Team</Typography>
          </Stack>

          <TeamMember />
          <Divider backgroundColor="#1F3244" />
          <TeamMember />
        </Stack>
      </Stack>

      <Backdrop open={loading} sx={{ opacity: 1 }}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
