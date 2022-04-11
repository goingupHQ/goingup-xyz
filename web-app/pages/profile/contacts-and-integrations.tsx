import { AppContext } from '@/contexts/AppContext';
import { WalletContext } from '@/contexts/WalletContext';
import { Twitter, GitHub, LinkedIn, Email } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
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
import { useSnackbar } from 'notistack';
import { useContext, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import VerifyTwitter from './verify-twitter'
import VerifyEmail from './verify-email';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const ContactsAndIntegrations = (props) => {
    const { account, refresh } = props;
    const verifyTwitterRef = useRef<any>(null);
    const verifyEmailRef = useRef<any>(null);

    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const myAccount = wallet.address === account.address;

    const emailChipClicked = async () => {
        if (account.email) {
            window.location.href = `mailto:${account.email}`;
        } else {
            if (myAccount) {
                verifyEmailRef.current.showModal();
            }
        }
    }

    const twitterChipClicked = () => {
        if (account.twitter) {
            window.open(`https://twitter.com/${account.twitter}`, '_blank');
        } else {
            if (myAccount) {
                const tweet = `Verifying myself for #GoingUP\n${account.address}`;
                const url = `https://twitter.com/intent/tweet?original_referer=goingup.xyz&source=tweetbutton&url=https://app.goingup.xyz&text=${encodeURIComponent(tweet)}`
                window.open(url, '_blank');

                verifyTwitterRef.current.showModal();
            }
        }
    }

    const githubChipClicked = async () => {
        if (account.github) {
            window.open(`https://github.com/${account.githubUser.login}`, '_blank');
            return;
        }

        if (myAccount) {
            const { address, ethersSigner } =  wallet;
            const message = 'connect-github';
            const signature = await wallet.signMessage(message);

            const auth = uuid();
            const savedResponse = await fetch(`/api/oauth/requests?address=${address}&uuid=${auth}&type=github&message=${message}&signature=${signature}`);

            if (savedResponse.status === 200) {
                const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
                const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/github`; console.log(redirectUri);
                const state = encodeURIComponent(JSON.stringify({ address, auth }));
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&allow_signup=true`;
            } else {
                enqueueSnackbar('Something went wrong connecting your GitHub account', { variant: 'error' });
            }
        }
    }

    const linkedinChipClicked = async () => {
        if (account.linkedIn) {
            // window.open(`https://github.com/${account.githubUser.login}`, '_blank');
            return;
        }

        if (myAccount) {
            const { address, ethersSigner } =  wallet;
            const message = 'connect-linkedin';
            const signature = await wallet.signMessage(message);
            const auth = uuid();
            const savedResponse = await fetch(`/api/oauth/requests?address=${address}&uuid=${auth}&type=linkedin&message=${message}&signature=${signature}`);

            if (savedResponse.status === 200) {
                const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
                const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/linkedin`; console.log(redirectUri);
                const state = encodeURIComponent(JSON.stringify({ address, auth }));
                const scope = encodeURIComponent('r_liteprofile r_emailaddress');
                window.location.href = `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
            } else {
                enqueueSnackbar('Something went wrong connecting your LinkedIn account', { variant: 'error' });
            }
        }
    }

    const discordChipClicked = async () => {
        if (account.discord) {
            window.open(`https://discord.com/users/${account.discordUser.id}`, '_blank');
            return;
        }

        if (myAccount) {
            const { address, ethersSigner } =  wallet;
            const message = 'connect-discord';
            const signature = await wallet.signMessage(message);

            const auth = uuid();
            const savedResponse = await fetch(`/api/oauth/requests?address=${address}&uuid=${auth}&type=discord&message=${message}&signature=${signature}`);

            if (savedResponse.status === 200) {
                const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
                const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/discord`; console.log(redirectUri);
                const state = encodeURIComponent(JSON.stringify({ address, auth }));
                const scope = encodeURIComponent('email identify');
                window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUri}&prompt=consent`;
            } else {
                enqueueSnackbar('Something went wrong connecting your GitHub account', { variant: 'error' });
            }
        }
    }

    return (
        <>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                alignItems="center"
                // sx={{
                //     marginBottom: { xs: '24px', md: '8px' }
                // }}
            >
                <Typography variant="h4">
                    Contacts &amp; Profiles
                </Typography>
                <Chip
                    icon={(<Email fontSize="small" />)}
                    label={
                        account.email ||
                        (myAccount ? 'Connect your Email' : 'not connected')
                    }
                    variant="outlined"
                    onClick={emailChipClicked}
                />
                <Chip
                    icon={(<Twitter fontSize="small" />)}
                    label={
                        (account.twitter ? `@${account.twitter}` : null) ||
                        (myAccount ? 'Connect your Twitter account' : 'not connected')
                    }
                    variant="outlined"
                    onClick={twitterChipClicked}
                />
                <Chip
                    icon={(<GitHub fontSize="small" />)}
                    label={
                        account.github ||
                        (myAccount ? 'Connect your GitHub account' : 'not connected')
                    }
                    variant="outlined"
                    onClick={githubChipClicked}
                />
                <Chip
                    icon={(<LinkedIn fontSize="small" />)}
                    label={
                        account.linkedIn ||
                        (myAccount ? 'Connect your LinkedIn account' : 'not connected')
                    }
                    variant="outlined"
                    onClick={linkedinChipClicked}
                />
                <Chip
                    icon={(<FontAwesomeIcon icon={faDiscord} />)}
                    label={
                        account.discord ||
                        (myAccount ? 'Connect your Discord account' : 'not connected')
                    }
                    variant="outlined"
                    onClick={discordChipClicked}
                />
            </Stack>
            <VerifyTwitter ref={verifyTwitterRef} account={account} />
            <VerifyEmail ref={verifyEmailRef} account={account} refresh={refresh} />
        </>
    );
};

export default ContactsAndIntegrations;
