import { trpc } from "@/utils/trpc";
import { Backdrop, Grid } from "@mui/material";
import LoadingIllustration from "../common/loading-illustration";

type GroupsListProps = {
  groupCode: string;
}

const GroupsList = ({ groupCode }: GroupsListProps) => {
  const { data: groups, isLoading: isGroupsLoading } = trpc.organizations.getGroups.useQuery({ code: groupCode }, { enabled: Boolean(groupCode) });

  return (
    <>
      {isGroupsLoading && <LoadingIllustration />}

      {!isGroupsLoading && groups && (
        <Grid container columnSpacing={2} rowSpacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} md={6} lg={4} key={group.code}>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default GroupsList;