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
            sx={{
                marginX: "25px",
                marginY: "30px",
                display: { sm: "none" },
            }}
        >
            <Box marginX={0} marginBottom={4}>
                <SearchBox />
            </Box>
            <Button
                variant='contained'
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        backgroundColor: "hoverPrimary.main",
                    },
                }}
            >
                <DashboardIcon size='small' />
                <Typography marginLeft={1}>Dashboard</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <ProjectsIcon />
                <Typography marginLeft={1}>Projects</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <ProfileIcon />
                <Typography marginLeft={1}>Profile</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <CollaboratorsIcon />
                <Typography marginLeft={1}> Collaborators</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <MessageIcon />
                <Typography marginLeft={1}> Messages</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <SettingsIcon />
                <Typography marginLeft={1}> Settings</Typography>
            </Button>
            <Button
                sx={{
                    color: "#4D5F72",
                    ":hover": {
                        color: "hoverTab.main",
                    },
                }}
            >
                <GlobeIcon />
                <Typography marginLeft={1}> Language</Typography>
            </Button>
        </Stack>
    );
}
