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
import { trim } from "../../components/utils";

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

  const AddressBar = ({ ethName, address }) => (
    <Stack
      height={4}
      width="320px"
      direction="row"
      sx={{ spacing: "0px", height: "28px" }}
    >
      <Stack
        sx={{
          backgroundColor: "#111921",
          border: "2px solid #253340",
          width: "50%",
          py: "2px",
        }}
        borderRadius="6px 0px 0px 6px"
      >
        <Typography textAlign="center" fontSize="14px">
          {ethName}
        </Typography>
      </Stack>
      <Stack
        sx={{
          backgroundColor: "#253340",
          width: "50%",
          py: "4px",
        }}
        borderRadius="0px 6px 6px 0px"
      >
        <Typography
          textAlign="center"
          fontSize="14px"
          variant="h6"
          color="white"
          sx={{ fontFamily: "Gilroy", fontWeight: "600" }}
        >
          {trim(address, 4, 5)}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Head>
        <title>Going UP - Project</title>
      </Head>
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

          <Stack
            p={4}
            sx={{ backgroundColor: "#111921" }}
            direction="row"
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Stack spacing="32px" direction="row">
              <Box
                component="img"
                sx={{
                  height: "50px",
                  width: "50px",
                }}
                borderRadius="360px"
                alt="Project owner."
                src="https://th-thumbnailer.cdn-si-edu.com/bBoKmhmRwKgjpcq3pMMV9VldIsc=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/38/ee/38ee7aaa-abbb-4c60-b959-4b1c5c8c6989/axgpay.jpg"
              />
              <Stack direction="column" spacing="20px">
                <Stack direction="column" spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: "Gilroy",
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "24px",
                      lineHeight: "29px",
                    }}
                  >
                    Team Member
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Gilroy",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#6E8094",
                    }}
                  >
                    Project Lead
                  </Typography>
                </Stack>
                <Stack>
                  <AddressBar
                    ethName={"member.eth"}
                    address={"0x0000000000000000000000000000000000000000"}
                  />
                </Stack>
              </Stack>
            </Stack>

            <Button
              sx={{ height: "40px", width: "160px" }}
              justifySelf="end"
              variant="contained"
            >
              Award
            </Button>
          </Stack>

          <Divider backgroundColor="#1F3244" />

          <Stack
            p={4}
            sx={{ backgroundColor: "#111921" }}
            direction="row"
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Stack spacing="32px" direction="row">
              <Box
                component="img"
                sx={{
                  height: "50px",
                  width: "50px",
                }}
                borderRadius="360px"
                alt="Project owner."
                src="https://th-thumbnailer.cdn-si-edu.com/bBoKmhmRwKgjpcq3pMMV9VldIsc=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/38/ee/38ee7aaa-abbb-4c60-b959-4b1c5c8c6989/axgpay.jpg"
              />
              <Stack direction="column" spacing="20px">
                <Stack direction="column" spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: "Gilroy",
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "24px",
                      lineHeight: "29px",
                    }}
                  >
                    Team Member
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Gilroy",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#6E8094",
                    }}
                  >
                    Project Lead
                  </Typography>
                </Stack>
                <Stack>
                  <AddressBar
                    ethName={"member.eth"}
                    address={"0x0000000000000000000000000000000000000000"}
                  />
                </Stack>
              </Stack>
            </Stack>

            <Button
              sx={{ height: "40px", width: "160px" }}
              justifySelf="end"
              variant="contained"
            >
              Award
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Backdrop open={loading} sx={{ opacity: 1 }}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
