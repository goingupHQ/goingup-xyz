import { useRef, useState, useEffect, useContext } from 'react';
import { WalletContext } from './../contexts/wallet-context';
import { useRouter } from 'next/router';

import {
    Avatar,
    Box,
    Button,
    Divider,
    alpha,
    List,
    ListItem,
    ListItemText,
    Popover,
    styled,
    Typography
} from '@mui/material';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenIcon from './../components/icons/LockOpenIcon';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import Identicon from './../components/common/Identicon';

const UserBoxButton = styled(Button)(
    ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    height: 48px;

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(24)};
    }

    .MuiAvatar-root {
      width: 34px;
      height: 34px;
    }

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
    ({ theme }) => `
        color: ${theme.palette.secondary.light};
`
);

const UserBoxDescriptionMain = styled(Typography)(
    ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[50]};
`
);

const UserBoxLabelMain = styled(Typography)(
    ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    display: block;
`
);

export default function UserBox () {
    const router = useRouter();
    const wallet = useContext(WalletContext);

    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        if (wallet.address === null) {
            wallet.connect();
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
                fullWidth
                color="secondary"
                ref={ref}
                onClick={handleOpen}
            >
                {wallet.address === null &&
                    <Avatar variant="rounded" />
                }

                {wallet.address !== null &&
                    <div style={{ paddingTop: '6px' }}>
                        <Identicon address={wallet.address} size={32} />
                    </div>
                }

                <Box
                    display="flex"
                    flex={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box
                        component="span"
                        sx={{
                            display: { xs: 'inline-block', md: 'inline-block' },
                            width: { xs: '120px', md: 'auto'},
                            maxWidth: { xs: '350px' }
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

                                {wallet.address !== null && wallet.address}
                            </UserBoxLabelMain>
                            {wallet.address &&
                                <UserBoxDescriptionMain
                                    variant="body2"
                                >
                                    {wallet.walletTypes[wallet.walletType]?.display} {wallet.networks[wallet.network]?.name}
                                </UserBoxDescriptionMain>
                            }
                        </UserBoxText>
                    </Box>
                    <UnfoldMoreTwoToneIcon
                        fontSize="small"
                        sx={{
                            ml: 1
                        }}
                    />
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
                        button
                    >
                        <AccountBoxTwoToneIcon fontSize="small" />
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
                        <WorkTwoToneIcon fontSize="small" />
                        <ListItemText primary="Projects" />
                    </ListItem>
                </List>
                <Divider />
                <Box m={1}>
                    <Button color="primary" fullWidth onClick={() => { wallet.disconnect(); handleClose(); }}>
                        <LockOpenIcon
                            sx={{
                                mr: 1
                            }}
                        />
                        Disconnect this wallet
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
