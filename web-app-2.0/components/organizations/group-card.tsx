import { OrganizationGroup } from "@/types/organization";
import { Paper, Typography } from "@mui/material";

type GroupCardProps = {
  group: OrganizationGroup;
}

const GroupCard = ({ group }: GroupCardProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Typography>{group.code}</Typography>
      <Typography>{group.name}</Typography>
      <Typography>{group.description}</Typography>

    </Paper>
  );
};

export default GroupCard;