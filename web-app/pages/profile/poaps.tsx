import React, { useContext, useRef, useState } from 'react';
import { WalletContext } from '@/src/contexts/WalletContext';
import { AppContext } from '@/src/contexts/AppContext';
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
    Avatar,
    IconButton,
    CircularProgress,
    Box
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import EditProfile from './edit-profile';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const Poaps = (props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { account } = props;
    const myAccount = wallet.address === account.address;

    const uploadCoverInputRef = useRef<any>(null);
    const uploadProfileInputRef = useRef<any>(null);
    const editProfileRef = useRef<any>(null);

    return (
        <>
            <Grid item xs={12}>
                <Fade in={true} timeout={1000}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        <CardHeader
                            sx={{
                                px: 3,
                                pt: 3,
                                alignItems: 'flex-start'
                            }}
                            title={
                                <>
                                    <Typography variant="h1">
                                        POAPs
                                    </Typography>
                                </>
                            }
                        />
                        <CardContentWrapper
                            sx={{
                                px: 3,
                                pt: 0
                            }}
                        >

                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>

            <EditProfile ref={editProfileRef} account={account} />
        </>
    )
}

export default Poaps;