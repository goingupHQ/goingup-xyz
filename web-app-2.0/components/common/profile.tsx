import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useRouter } from 'next/router';
import { AppContext } from '../../contexts/app-context';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { Account } from '@/types/account';

type ProfileProps = {
  addressOrAccount: string | Account;
};

const Profile = ({ addressOrAccount }: ProfileProps) => {
  const app = useContext(AppContext);
  const router = useRouter();

  const {
    data: accountTrpc,
    isFetching: isAccountFetchingTrpc,
    isFetched: isAccountFetchedTrpc,
  } = trpc.accounts.get.useQuery(
    { address: addressOrAccount as string },
    { enabled: typeof addressOrAccount === 'string' }
  );

  const account = typeof addressOrAccount === 'string' ? accountTrpc : addressOrAccount;
  const address = typeof addressOrAccount === 'string' ? addressOrAccount : account?.address;
  const isAccountFetching = typeof addressOrAccount === 'string' ? isAccountFetchingTrpc : false;
  const isAccountFetched = typeof addressOrAccount === 'string' ? isAccountFetchedTrpc : true;

  const [ensName, setEnsName] = useState('');

  useEffect(() => {
    if (!address) return;

    fetch(`/api/accounts/get-ens-name?address=${address}`)
      .then(async (response) => {
        if (response.ok) {
          const result = await response.text();
          if (result) setEnsName(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [address]);

  return (
    <>
      {isAccountFetching && (
        <Card
          sx={{
            padding: '24px',
          }}
        >
          <CardHeader
            avatar={
              <Skeleton
                variant="circular"
                sx={{ width: { xs: 60, md: 114 }, height: { xs: 60, md: 114 } }}
              />
            }
            title={
              <>
                <Skeleton
                  variant="text"
                  width="100%"
                  height={24}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                />
              </>
            }
          />

          <Stack
            direction="column"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={'10px'}
          >
            <Skeleton
              variant="text"
              width="100%"
              height={24}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={24}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={24}
            />
          </Stack>
        </Card>
      )}

      {isAccountFetched && !isAccountFetching && account && (
        <Card
          sx={{
            padding: '24px',
          }}
        >
          <CardHeader
            avatar={
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      backgroundColor: {
                        xs: 'none',
                        md: app.mode === 'dark' ? '#121E28' : '#FFFFFF',
                      },
                      borderRadius: '50%',
                      padding: '3px',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: app.mode === 'dark' ? '#121E28' : '#FFFFFF',
                        borderRadius: '50%',
                        padding: {
                          xs: '17px',
                          md: 'none',
                        },
                        position: 'absolute',
                        marginTop: '8px',
                        marginLeft: '8px',
                      }}
                    />
                    <CircularProgress
                      size={50}
                      variant="determinate"
                      sx={{
                        position: 'absolute',
                        color: app.mode === 'dark' ? '#1D3042' : '#CFCFCF',
                        padding: {
                          xs: 1,
                          sm: 1,
                          md: 0,
                        },
                      }}
                      thickness={7}
                      value={100}
                    />
                    <CircularProgress
                      size={50}
                      thickness={7}
                      variant="determinate"
                      color="success"
                      value={100 * ((account?.reputationScore || 0) / app.maxReputationScore)}
                      sx={{
                        color: '#3AB795',
                        position: 'relative',
                        display: 'inline-flex',
                        padding: {
                          xs: 1,
                          sm: 1,
                          md: 0,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography color={'#3AB795'}>
                        {' '}
                        {Math.round(100 * ((account?.reputationScore || 0) / app.maxReputationScore))}%
                      </Typography>
                    </Box>
                  </Box>
                }
              >
                <Avatar
                  src={account?.profilePhoto}
                  sx={{
                    width: {
                      xs: 60,
                      md: 114,
                    },
                    height: {
                      xs: 60,
                      md: 114,
                    },
                  }}
                />
              </Badge>
            }
            title={
              <>
                <Typography variant="h3">{account?.name}</Typography>
                <Box>
                  <Typography color="#6E8094">
                    {app.occupations.find((o) => o.id == account?.occupation)?.text || 'None'}
                  </Typography>
                </Box>
              </>
            }
          />
          <Stack
            sx={{
              border: 3,
              borderColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
              borderRadius: '8px',

              backgroundColor: app.mode === 'dark' ? '#253340' : '#CFCFCF',
            }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={'10px'}
          >
            {ensName && (
              <Box
                sx={{
                  backgroundColor: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                  borderRadius: '4px',

                  paddingY: { md: '5px' },
                  paddingBottom: '3px',
                  mx: 'auto',
                  ml: 'none',
                  paddingX: '20px',
                }}
              >
                <Typography>{ensName}</Typography>
              </Box>
            )}
            <Typography
              sx={{
                mx: 'auto',
                paddingX: '10px',
                paddingY: { md: '5px' },
              }}
            >
              {account?.chain === 'Ethereum' && <>{truncateEthAddress(account?.address || '')}</>}
              {account?.chain != 'Ethereum' &&
                `${account?.address?.substring(0, 6)}...${account?.address?.substring(
                  account?.address?.length - 4,
                  account?.address?.length
                )}`}
            </Typography>
          </Stack>
          <Link href={`/profile/${account?.address}`}>
            <Button
              variant="contained"
              sx={{
                width: '100%',
              }}
            >
              View Profile
            </Button>
          </Link>
        </Card>
      )}
    </>
  );
};

export default Profile;
