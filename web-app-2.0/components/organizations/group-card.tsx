import { OrganizationGroup, OrganizationGroupMember } from '@/types/organization';
import { Paper, Typography } from '@mui/material';
import AddressInput from '../common/address-input';
import { useEffect, useState } from 'react';

type GroupCardProps = {
  group: OrganizationGroup;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const [addressInputValue, setAddressInputValue] = useState<string>('');

  useEffect(() => {
    if (!addressInputValue) return;
  }, [addressInputValue]);

  return (
    <Paper
      variant="elevation"
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Typography>{group.code}</Typography>
      <Typography>{group.name}</Typography>
      <Typography>{group.description}</Typography>

      <AddressInput
        label="Search for users to add to this group"
        value={addressInputValue}
        setValue={setAddressInputValue}
        onChange={(value) => console.log(value)}
        sx={{ mt: 3, width: 'auto', minWidth: { xs: '100%', md: '400px' } }}
      />
    </Paper>
  );
};

export default GroupCard;
