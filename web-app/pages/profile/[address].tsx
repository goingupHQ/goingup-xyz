import React, { useContext, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import TopSection from './top-section';
import {
    Grid,
    CardContent,
    styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import Projects from './projects';
import Poaps from './poaps';
import AppreciationTokens from './appreciation-tokens';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

function ProfilePage() {
    const [account, setAccount] = useState<any>(null)
    const router = useRouter();
    const { address } = router.query;
    console.log(router.query)

    const getAccount = async () => {
        if (address) {
            const response = await fetch(`/api/get-account?address=${address}`);
            setAccount(await response.json());
        }
    }

    useEffect(() => {
        getAccount();
    }, [address])

    return (
        <>
            {account &&
            <>
                <Head>
                    <title>{possessive(account?.name)} GoingUP Profile</title>
                </Head>

                <Grid
                    sx={{ px: { xs: 2, md: 4 }, marginBottom: 10 }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <TopSection account={account} refresh={getAccount} />
                    <Projects account={account} />
                    <AppreciationTokens account={account} refresh={getAccount} />
                    <Poaps account={account} refresh={getAccount} />
                </Grid>
            </>
            }
        </>
    );
}

ProfilePage.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default ProfilePage;
