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
              sx={{ width: 60, height: 60, borderRadius: "2px" }}
            />
            <Typography variant="h4">{org?.name}</Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">Organization Owners</Typography>
            <Typography>
              Please email us at <a href="mailto:app@goingup.xyz">app@goingup.xyz</a> if you want to make changes to
              your organization&apos;s ownership.
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default OrgPageHeader;
