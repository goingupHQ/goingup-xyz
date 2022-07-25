import { useState } from "react";
import { Box, Stack, Button, Typography } from "@mui/material";

export default function Sidebar() {
    const [showSideBar, setshowSideBar] = useState(true);
    const onClick = () => setshowSideBar(true);

    return (
        <Box display={{ xs: "none", sm: "block" }}>
            <Stack
                direction='column'
                justifyContent='flex-start'
                alignItems='flex-start'
                spacing={1}
                sx={{
                    marginX: {
                        xs: "25px",
                    },
                }}
            >
                <Button
                    variant='contained'
                    color='sidebar'
                    sx={{
                        color: "#F4CE00",
                    }}
                >
                    All Projects
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    Open Metaverse
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    DAOs
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    NFTs
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    DeFi
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    CryptoArt
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    Audio Visual
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    Charities
                </Button>
                <Button
                    sx={{
                        color: "#4D5F72",
                    }}
                >
                    Other projects
                </Button>
            </Stack>
        </Box>
    );
}
