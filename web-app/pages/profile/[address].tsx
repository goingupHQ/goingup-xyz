import React, { useContext, useRef, useState } from 'react';
import Head from 'next/head';
import possessive from '@wardrakus/possessive';
import { v4 as uuid } from 'uuid';
import { WalletContext } from 'src/contexts/WalletContext';
import { AppContext } from '@/contexts/AppContext';
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

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

export async function getServerSideProps(context) {
    const { address } = context.params;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-account?address=${address}`
    );

    if (response.status === 404) return { notFound: true };

    const account = await response.json();

    return {
        props: {
            account
        }
    };
}

function CreateAccount(props) {
    const { account } = props;
    return (
        <>
            <Head>
                <title>{possessive(account.name)} GoingUP Profile</title>
            </Head>
            <TopSection account={account} />
        </>
    );
}

CreateAccount.getLayout = (page) => (
    <TopNavigationLayout>{page}</TopNavigationLayout>
);

export default CreateAccount;
