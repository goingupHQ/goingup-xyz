import { Organization } from '@/types/organization';
import Navigation from './navigation';
import { Box, Stack, Typography } from '@mui/material';

type OrgPageHeaderProps = {
  org?: Organization | null;
};

const OrgPageHeader = ({ org }: OrgPageHeaderProps) => {
  return (
    <>
      {Boolean(org) && (
        <>
          <Navigation org={org} />

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Box
              component="img"
              src={org?.logo}
              sx={{ width: 60, height: 60, borderRadius: '5px' }}
            />
            <Typography variant="h4">{org?.name}</Typography>
          </Stack>
        </>
      )}
    </>
  );
};

export default OrgPageHeader;
