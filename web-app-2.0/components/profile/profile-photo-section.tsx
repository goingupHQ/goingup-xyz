import { Avatar, Badge, Box, CardHeader, CircularProgress, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import FollowersList, { FollowersListRef } from './followers-list';
import FollowingList, { FollowingListRef } from './following-list';
import UploadProfilePhoto from './upload-profile-photo';
import { AppContext } from '@/contexts/app-context';
import { Account } from '@/types/account';
import { trpc } from '@/utils/trpc';

type ProfilePhotoSectionProps = {
  account: Account;
  refresh: () => void;
};

const ProfilePhotoSection = ({ account, refresh }: ProfilePhotoSectionProps) => {
  const app = useContext(AppContext);

  const { data: isHolder, isLoading: checkHolder } = trpc.accounts.isMembershipNftHolder.useQuery(
    { address: account.address! },
    { enabled: Boolean(account.address) }
  );

  const { data: followStats,
    isLoading: gettingFollowStats,
  } = trpc.accounts.getFollowStats.useQuery({ address: account.address! }, { enabled: Boolean(account.address) });

  const followersListRef = useRef<FollowersListRef>(null);
  const followingListRef = useRef<FollowingListRef>(null);

  return (
    <>
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
                  value={100 * (account.reputationScore / app.maxReputationScore)}
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
                    {Math.round(100 * (account.reputationScore / app.maxReputationScore))}%
                  </Typography>
                </Box>
              </Box>
            }
          >
            <Avatar
              src={account.profilePhoto}
              sx={{
                marginLeft: '-15px',
                marginTop: '-15px',
                width: { xs: 60, md: 114 },
                height: { xs: 60, md: 114 },
              }}
            />
          </Badge>
        }
        title={
          <>
            {checkHolder && <CircularProgress size={'14px'} />}
            {!checkHolder && isHolder && (
              <Typography
                sx={{
                  backgroundColor: app.mode === 'dark' ? '#192530' : '#CFCFCF',
                  borderRadius: '8px',
                  width: 'fit-content',
                  padding: '6px 12px',
                }}
              >
                💎 OG Member
              </Typography>
            )}
            <Typography
              marginTop={'10px'}
              variant="h1"
            >
              {account.name}
            </Typography>
            <Box>
              <Typography>{app.occupations.find((o) => o.id == account.occupation)?.text || 'None'}</Typography>
            </Box>
            <Box>
              <Typography color="#6E8094">
                Looking for:{' '}
                {account.idealCollab && (
                  <>
                    {account.idealCollab.map((item) => (
                      <Typography
                        marginLeft={1}
                        color={app.mode === 'dark' ? '#FFFFFF' : '#22272F'}
                        key={item}
                      >
                        {app.occupations.find((o) => o.id == item)?.text}
                      </Typography>
                    ))}
                  </>
                )}
              </Typography>
              <Stack
                sx={{
                  borderRadius: '4px',
                }}
              >
                {gettingFollowStats && (
                  <Typography>
                    Getting follow stats <CircularProgress size="14px" />
                  </Typography>
                )}
                {!gettingFollowStats && (
                  <>
                    <Typography>
                      <span
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => followersListRef?.current?.showModal()}
                      >
                        {followStats?.followers || 0} Follower
                        {followStats?.followers || 0 > 1 ? 's' : ''}
                      </span>
                      {' | '}
                      <span
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => followingListRef?.current?.showModal()}
                      >
                        {followStats?.following || 0} Following
                      </span>
                    </Typography>
                    <UploadProfilePhoto
                      account={account}
                      refresh={refresh}
                    />
                  </>
                )}
              </Stack>
            </Box>
            <FollowersList
              ref={followersListRef}
              account={account}
            />
            <FollowingList
              ref={followingListRef}
              account={account}
            />
          </>
        }
      />
    </>
  );
};

export default ProfilePhotoSection;
