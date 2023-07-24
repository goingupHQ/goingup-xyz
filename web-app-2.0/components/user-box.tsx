import { useRef, useState, useContext, createRef } from 'react';
import { WalletContext } from '../contexts/wallet-context';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  Popover,
  styled,
  Typography,
  useTheme,
  Stack,
} from '@mui/material';
import truncateEthAddress from 'truncate-eth-address';
import LockOpenIcon from './icons/LockOpenIcon';
import Identicon from './common/Identicon';
import WalletChainSelection, { WalletChainSelectionHandles } from '../contexts/wallet-chain-selection';
import CollaboratorsIcon from './icons/CollaboratorsIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ProjectsIcon from './icons/ProjectsIcon';
import ProfileIcon from './icons/ProfileIcon';
import WalletIcon from './icons/WalletIcon';
import { useAccount, useBalance } from 'wagmi';
import { ethers } from 'ethers';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: 2;
    background-color: ${theme.palette.background.default};
    height: 40px;
    width: 168px;
    min-width: 90px;
    max-width: 168px;
    &.Mui-active,
    &:hover {
      .MuiSvgIcon-root {
      }
    }
    overflow: hidden;

    .MuiButton-label {
      justify-content: flex-start;
    }
`
);

export default function UserBox() {
  const router = useRouter();
  const theme = useTheme();

  const wallet = useContext(WalletContext);
  const { address } = wallet;
  const { data: balanceData } = useBalance({ address: (address as `0x${string}`) || ethers.constants.AddressZero });
  const balance = Number(balanceData?.formatted);


  const ref = useRef(null);
  const chainSelectionRef = createRef<WalletChainSelectionHandles>();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    if (address === null) {
      // wallet.connectEthereum();
      chainSelectionRef?.current?.showModal();
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
            {address === null && (
              <Box sx={{ paddingLeft: '4px', paddingTop: '10px' }}>
                <CollaboratorsIcon color={theme.palette.text.primary} />
                {/* <Avatar variant="rounded" /> */}
              </Box>
            )}

            {address !== null && (
              <Box sx={{ paddingLeft: '8px', paddingTop: '7px' }}>
                <span>
                  <Identicon
                    address={address}
                    size={19}
                  />
                </span>
              </Box>
            )}
          </>
        }
        endIcon={<ChevronDownIcon color={theme.palette.text.primary} />}
      >
        <Box
          display="flex"
          flex={1}
          alignItems="center"
        >
          <Typography
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {address === null && `Connect Wallet`}

              {address !== null && truncateEthAddress(address)}
            </Typography>
          </Typography>
        </Box>
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current!}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
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
          <ListItemButton
            onClick={() => {
              handleClose();
              router.push(`/profile/${address}`);
            }}
            sx={{
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >
              <ProfileIcon color={theme.palette.text.primary} />
              <Typography variant="body1">Profile</Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              handleClose();
              router.push(`/projects`);
            }}
            sx={{
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >
              <ProjectsIcon color={theme.palette.text.primary} />
              <Typography variant="body1">Projects</Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              handleClose();
              router.push(`/projects`);
            }}
            sx={{
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >
              <WalletIcon color={theme.palette.text.primary} />
              <Typography variant="body1">{balance.toLocaleString()} {balanceData?.symbol || 'MATIC'}</Typography>
            </Stack>
          </ListItemButton>

          <Divider sx={{ marginY: 2 }} />

          <ListItemButton
            onClick={() => {
              wallet.disconnect();
              handleClose();
            }}
            sx={{
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >
              <LockOpenIcon color={theme.palette.text.primary} />
              <Typography variant="body1">Disconnect this wallet</Typography>
            </Stack>
          </ListItemButton>
        </List>
      </Popover>
      <WalletChainSelection ref={chainSelectionRef} />
    </>
  );
}
