import React, { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import possessive from "@wardrakus/possessive";
import TopSection from "../../components/pages/profile/top-section";
import {
    Grid,
    CardContent,
    styled,
    Fade,
    Box,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Projects from "../projects";
import Poaps from "../../components/pages/profile/poaps";
import AppreciationTokens from "../../components/pages/profile/appreciation-tokens";
import ProfileSection from "../../components/pages/profile/profile-section";
import TokensAndPoaps from "../../components/pages/profile/tokens-poaps";

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

function ProfilePage() {
    const [account, setAccount] = useState(null);
    const router = useRouter();
    const { address } = router.query;
    console.log(router.query);

    const getAccount = async () => {
        if (address) {
            const response = await fetch(`/api/get-account?address=${address}`);
            setAccount(await response.json());
        }
    };

    useEffect(() => {
        // do some
        getAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return (
        <>
            {account && (
                <>
                    <Head>
                        <title>
                            {possessive(account?.name)} GoingUP Profile
                        </title>
                    </Head>
                    <Box
                        justifyContent='center'
                        alignItems='center'
                        sx={{
                            marginBottom: "20px",
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <Typography variant='h2'>{account?.name}</Typography>
                    </Box>
                    <Fade in={true} timeout={1000}>
                        <Box>
                            <ProfileSection
                                account={account}
                                refresh={getAccount}
                            />
                            <TokensAndPoaps
                                account={account}
                                refresh={getAccount}
                            />
                            {/* <TopSection
                                account={account}
                                refresh={getAccount}
                            /> */}
                            {/* <Projects account={account} /> */}

                            {/* <AppreciationTokens
                                account={account}
                                refresh={getAccount}
                            /> */}
                            {/* <Poaps account={account} refresh={getAccount} /> */}
                        </Box>
                    </Fade>
                </>
            )}
        </>
    );
}

export default ProfilePage;
