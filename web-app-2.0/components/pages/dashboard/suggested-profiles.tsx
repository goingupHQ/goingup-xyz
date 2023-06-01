import { Box, CircularProgress, Fade, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import LoadingIllustration from '../../common/loading-illustration';
import Profile from '../../common/profile';
import { trpc } from '@/utils/trpc';

export default function SuggestedProfiles() {
  const {
    data: potentialCollabs,
    isLoading: gettingPotentialCollabs,
    refetch: refetchPotentialCollabs,
  } = trpc.profiles.getPotentialCollaborators.useQuery({ count: 12, onlyProfilesWithPhotos: false }, {
    cacheTime: 0,
  });

  const {
    mutateAsync: searchProfiles,
    isLoading: searchingProfiles,
    data: profileSearchResults,
  } = trpc.profiles.searchForProfiles.useMutation();

  const [search, setSearch] = useState<string>('');
  const [showProfileSearch, setShowProfileSearch] = useState<boolean>(false);

  const searchProfile = React.useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) {
          setShowProfileSearch(false);
          refetchPotentialCollabs();
          return;
        }
        setShowProfileSearch(true);
        searchProfiles({ nameQuery: value });
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loading = gettingPotentialCollabs || searchingProfiles;
  const data = showProfileSearch ? profileSearchResults : potentialCollabs;

  return (
    <>
      <Fade
        in={true}
        timeout={1000}
      >
        <Box>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent={{ xs: 'initial', md: 'space-between' }}
            sx={{ mb: 2 }}
            spacing={3}
          >
            <Typography variant="h1">Suggested Profiles</Typography>
            <TextField
              variant="outlined"
              label="Search Profiles"
              placeholder="Stephania Silva"
              sx={{ width: { xs: '100%', md: '300px' } }}
              disabled={loading}
              InputProps={{
                endAdornment: <>{loading && <CircularProgress size={14} />}</>,
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                searchProfile(e.target.value);
              }}
            />
          </Stack>

          {loading ? (
            <Box sx={{ mt: '100px' }}>
              <LoadingIllustration />
            </Box>
          ) : (
            <Grid
              container
              spacing={4}
            >
              {data?.map((account, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={account.address}
                >
                  <Profile addressOrAccount={account} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>
    </>
  );
}
