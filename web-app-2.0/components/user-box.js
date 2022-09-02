import { useRef, useState, useEffect, useContext } from 'react';
import { WalletContext } from './../contexts/wallet-context';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    Popover,
    styled,
    Typography,
    useTheme,
    Stack
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
    height: 40px;
    width: 168px;
    min-width: 90px;
    max-width: 168px;
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
    color: ${theme.palette.text.main};
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
                        <Box sx={{ paddingLeft: '4px', paddingTop: '10px'}}>
                        <CollaboratorsIcon color={theme.palette.text.main} />
                        {/* <Avatar variant="rounded" /> */}
                        </Box>
                        }

                        {wallet.address !== null &&
                            <Box sx={{ paddingLeft: '8px', paddingTop: '7px' }}>
                                <Identicon address={wallet.address} size={19}/>
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
                    <UserBoxText
                        sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        <UserBoxLabelMain variant="walletText">
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
            </UserBoxButton>
            <Popover
                disableScrollLock
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                marginThreshold={24}
            >
                <List
                    sx={{
                        p: 1,
                        width: 'auto',
                    }}
                    component="nav"
                >
                    <ListItem
                        onClick={() => {
                            handleClose();
                            router.push(`/profile/${wallet.address}`)
                        }}
                        button
                        sx={{
                            borderRadius: theme.shape.borderRadius
                        }}
                    >
                        <Stack direction="row" spacing={1}>
                            <ProfileIcon color={theme.palette.text.main} />
                            <Typography variant="body1">Profile</Typography>
                        </Stack>
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            handleClose();
                            router.push(`/projects`);
                        }}
                        button
                        sx={{
                            borderRadius: theme.shape.borderRadius
                        }}
                    >
                        <Stack direction="row" spacing={1}>
                            <ProjectsIcon color={theme.palette.text.main} />
                            <Typography variant="body1">Projects</Typography>
                        </Stack>
                    </ListItem>

                    <Divider sx={{ marginY: 2 }} />

                    <ListItem
                        onClick={() => {
                            wallet.disconnect();
                            handleClose();
                        }}
                        button
                        sx={{
                            borderRadius: theme.shape.borderRadius
                        }}
                    >
                        <Stack direction="row" spacing={1}>
                            <LockOpenIcon color={theme.palette.text.main} />
                            <Typography variant="body1">Disconnect this wallet</Typography>
                        </Stack>
                    </ListItem>
                </List>
            </Popover>
            <WalletChainSelection ref={chainSelectionRef} />
        </>
    );
}
