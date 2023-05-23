import { trpc } from '@/utils/trpc';
import { Backdrop, Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import LoadingIllustration from '../common/loading-illustration';
import GroupCard from './group-card';
import { useEffect, useState } from 'react';
import { OrganizationGroup } from '@/types/organization';

type GroupsListProps = {
  groupCode: string;
};

const GroupsList = ({ groupCode }: GroupsListProps) => {
  const { data: groups, isLoading: isGroupsLoading } = trpc.organizations.getGroups.useQuery(
    { code: groupCode },
    { enabled: Boolean(groupCode) }
  );

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<OrganizationGroup | null>(null);

  const selectedTabChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (selectedTab && groups) {
      const selectedGroup = groups.find((group) => group.code === selectedTab);
      setSelectedGroup(selectedGroup || null);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (groups) {
      setSelectedTab(groups[0].code);
    }
  }, [groups]);

  return (
    <>
      {isGroupsLoading && <LoadingIllustration />}

      {!isGroupsLoading && groups && (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={selectedTab}
            onChange={selectedTabChangeHandler}
            centered
          >
            {groups.map((group) => (
              <Tab key={group.code} label={group.name} value={group.code} />
            ))}
          </Tabs>
          {selectedGroup && <GroupCard group={selectedGroup} />}
        </Box>
      )}
    </>
  );
};

export default GroupsList;
