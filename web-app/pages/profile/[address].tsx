import React, { useContext, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
import TopSection from './top-section';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Button,
    Fade,
    Stack,
    Chip,
    CardMedia,
    CardActions,
    Avatar,
    IconButton,
    Input,
    CircularProgress
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import ContactsAndIntegrations from './contacts-and-integrations';
import { getAccount } from 'pages/api/get-account';
import Poaps from './poaps';

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

    useEffect(() => {
        if (address) {
            const response = fetch(
                `/api/get-account?address=${address}`
            ).then(async response => {
                setAccount(await response.json());
            });
        }

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
                    <TopSection account={account} />
                    <Poaps account={account} />
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
