import { Box, Button, Stack, Typography } from "@mui/material";
import DashboardIcon from "./icons/DashboardIcon";
import ProjectsIcon from "./icons/ProjectsIcon";
import ProfileIcon from "./icons/ProfileIcon";
import CollaboratorsIcon from "./icons/CollaboratorsIcon";
import SearchBox from "./SearchBox";
import MessageIcon from "./icons/MessageIcon";
import GlobeIcon from "./icons/GlobeIcon";
import SettingsIcon from "./icons/SettingsIcon";

export default function MobileDashboard() {
    return (
        <Stack
            spacing={3}
            alignItems="flex-start"
            sx={{
                marginX: "25px",
                marginY: "30px",
                display: { sm: "none" },
            }}
        >
            <Box width='100%' marginBottom={1}>
                <SearchBox />
            </Box>
            <Button
                sx={{
                    color: "#F4CE00",
                    ":hover": {
                        backgroundColor: "hoverPrimary.main",
                    },
                }}
            >
                <DashboardIcon color={'#F4CE00'} />
                <Typography marginLeft={1}>Dashboard</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF"
                }}
            >
                <ProjectsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}>Projects</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <ProfileIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}>Profile</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <CollaboratorsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Collaborators</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <MessageIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Messages</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <SettingsIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Settings</Typography>
            </Button>
            <Button
                sx={{
                    color: "#FFFFFF",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <GlobeIcon color={'#FFFFFF'} />
                <Typography marginLeft={1}> Language</Typography>
            </Button>
        </Stack>
    );
}
