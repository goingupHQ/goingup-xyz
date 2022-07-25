import { useRef, useState, useEffect, useContext } from 'react';
import { WalletContext } from './../contexts/wallet-context';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Divider,
    alpha,
    List,
    ListItem,
    ListItemText,
    Popover,
    styled,
    Typography,
    useTheme
} from '@mui/material';
import truncateEthAddress from 'truncate-eth-address';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenIcon from './../components/icons/LockOpenIcon';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import Identicon from './../components/common/Identicon';
import WalletChainSelection from '../contexts/wallet-chain-selection';
import CollaboratorsIcon from './icons/CollaboratorsIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { AppContext } from '../contexts/app-context';
import ProjectsIcon from './icons/ProjectsIcon';
import ProfileIcon from './icons/ProfileIcon';

const UserBoxButton = styled(Button)(
    ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    background-color: ${theme.palette.background.userBox};
    height: 48px;
    width: 200px;
    min-width: 180px;
    max-width: 200px;
    &.Mui-active,
    &:hover {
      .MuiSvgIcon-root {
      }
    }

    .MuiButton-label {
      justify-content: flex-start;
    }
`
);

const MenuUserBox = styled(Box)(
    ({ theme }) => ``
);

const UserBoxText = styled(Box)(
    ({ theme }) => ``
);

const UserBoxDescription = styled(Typography)(
    ({ theme }) => ``
);

const UserBoxDescriptionMain = styled(Typography)(
    ({ theme }) => `
    color: ${theme.palette.text};
    `
);

const UserBoxLabelMain = styled(Typography)(
    ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.text.main};
    display: block;
`
);

export default function UserBox () {
    const router = useRouter();
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);
    const theme = useTheme();

    const ref = useRef(null);
    const chainSelectionRef = useRef(null);
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        if (wallet.address === null) {
            let cache;

            try {
                cache = JSON.parse(localStorage.getItem('wallet-context-cache'));
            } catch (err) {}

            if (cache) {
                if (!wallet.address) {
                    if (cache.blockchain === 'ethereum') {
                        wallet.connectEthereum();
                    } else if (cache.blockchain === 'cardano') {
                        wallet.connectCardano();
                    }
                }
            } else {
                if (!wallet.address) chainSelectionRef.current.showModal();
            }
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <UserBoxButton
                color="secondary"
                ref={ref}
                onClick={handleOpen}
                startIcon={
                    <>
                        {wallet.address === null &&
                            <CollaboratorsIcon color={theme.palette.text.main} />
                            // <Avatar variant="rounded" />
                        }

                        {wallet.address !== null &&
                            <Box sx={{ paddingTop: '12px' }}>
                                <Identicon address={wallet.address} size={24} />
                            </Box>
                        }
                    </>
                }
                endIcon={
                    <ChevronDownIcon color={theme.palette.text.main} />
                }
            >
                <Box
                    display="flex"
                    flex={1}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            display: { xs: 'inline-block', md: 'inline-block' },
                        }}
                    >
                        <UserBoxText
                            sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            <UserBoxLabelMain variant="body1">
                                {wallet.address === null &&
                                    `Connect Wallet`
                                }

                                {wallet.address !== null &&
                                    truncateEthAddress(wallet.address)
                                }
                            </UserBoxLabelMain>
                            {/* {wallet.address &&
                                <UserBoxDescriptionMain
                                    variant="body2"
                                >
                                    {wallet.walletTypes[wallet.walletType]?.display} {wallet.networks[wallet.network]?.name}
                                </UserBoxDescriptionMain>
                            } */}
                        </UserBoxText>
                    </Box>
                </Box>
            </UserBoxButton>
            <Popover
                disableScrollLock
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center'
                }}
            >
                <List
                    sx={{
                        p: 1
                    }}
                    component="nav"
                >
                    <ListItem
                        onClick={() => {
                            handleClose();
                            router.push(`/profile/${wallet.address}`)
                        }}
                        button={true}
                    >
                        <ListItemText primary="Profile" />
                    </ListItem>
                    {/* <ListItem
                        onClick={() => {
                            handleClose();
                        }}
                        button
                    >
                        <InboxTwoToneIcon fontSize="small" />
                        <ListItemText primary={t('Inbox')} />
                    </ListItem> */}
                    <ListItem
                        onClick={() => {
                            handleClose();
                            router.push(`/projects`);
                        }}
                        button
                    >
                        <ProjectsIcon />
                        <ListItemText primary="Projects" />
                    </ListItem>
                </List>
                <Divider />
                <Box m={1}>
                    <Button color="primary" fullWidth onClick={() => { wallet.disconnect(); handleClose(); }} startIcon={<LockOpenIcon color="primary" />}>
                        Disconnect this wallet
                    </Button>
                </Box>
            </Popover>
            <WalletChainSelection ref={chainSelectionRef} />
        </>
    );
}
