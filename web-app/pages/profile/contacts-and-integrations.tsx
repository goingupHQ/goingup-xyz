import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { Twitter } from '@mui/icons-material';
import {
    Grid,
    Fade,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Stack,
    Chip
} from '@mui/material';
import possessive from '@wardrakus/possessive';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useRef } from 'react';
import VerifyTwitter from './verify-twitter'

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const ContactsAndIntegrations = (props) => {
    const { account } = props;
    const verifyTwitterRef = useRef<any>(null);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const myAccount = wallet.address === account.address;

    const twitterChipClicked = () => {
        if (account.twitter) {
            // open twitter profile in new tab
        } else {
            if (myAccount) {
                const tweet = `Verifying myself for #GoingUP\n${account.address}`;
                const url = `https://twitter.com/intent/tweet?original_referer=goingup.xyz&source=tweetbutton&url=https://app.goingup.xyz&text=${encodeURIComponent(tweet)}`
                window.open(url, '_blank');

                verifyTwitterRef.current.showModal();
            }
        }
    }

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
                                        {possessive(account.name)} Contacts and
                                        Integrations
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
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    marginBottom: { xs: '24px', md: '8px' }
                                }}
                            >
                                <Typography variant="h4">Twitter</Typography>
                                <Chip
                                    icon={(<Twitter fontSize="small" />)}
                                    label={
                                        (account.twitter ? `@${account.twitter}` : null) ||
                                        (myAccount ? 'Connect your Twitter account' : 'not connected')
                                    }
                                    variant="outlined"
                                    onClick={twitterChipClicked}
                                />
                            </Stack>
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>
            <VerifyTwitter ref={verifyTwitterRef} />
        </>
    );
};

export default ContactsAndIntegrations;
