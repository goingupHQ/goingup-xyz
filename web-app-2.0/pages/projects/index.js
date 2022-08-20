import Head from "next/head";
import { Box, Button, Stack, Typography } from "@mui/material";
import { AppContext } from "../../contexts/app-context";
import { useContext } from "react";
import { WalletContext } from "../../contexts/wallet-context";
import { ProjectsContext } from "../../contexts/projects-context";
import ProjectsList from "../../components/pages/projects/projects-list";
import { useAccount, useNetwork, useSwitchNetwork} from "wagmi";
export default function Projects() {
  const app = useContext(AppContext);
  const wallet = useContext(WalletContext);
  const projectsContext = useContext(ProjectsContext);
  const account = useAccount();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  return (
    <>
      <Head>
        <title>GoingUP: Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ paddingTop: "20px" }}>
        {account.address === null && (
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={4}
          >
            <Typography variant="h2">
              You need a connected wallet with a GoingUP account to access
              Projects
            </Typography>
            <img
              src="/images/illustrations/connection-lost.svg"
              alt="connection-lost"
              style={{ width: "100%", maxWidth: "500px" }}
            />
          </Stack>
        )}

        {account.address !== null && (
          <>
            {chain?.unsupported && (
              <Stack
                justifyContent="center"
                alignItems="center"
                direction="column"
                spacing={4}
              >
                <Typography variant="h2">
                  You need to switch to{" "}
                  {chains[0] === chain?.id ? "Polygon" : "Polygon Mumbai"} to
                  access Projects
                </Typography>

                <img
                  src="/images/illustrations/page-lost.svg"
                  alt="connection-lost"
                  style={{ width: "100%", maxWidth: "500px" }}
                />
                {switchNetwork &&
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => switchNetwork(chains[0] === chain?.id ? 137 : 80001)}
                >
                  Switch to{" "}
                  {chains[0] === chain?.id ? "Polygon" : "Polygon Mumbai"}
                </Button>}
              </Stack>
            )}

            {!chain?.unsupported && (
              <>
                <ProjectsList />
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
}
