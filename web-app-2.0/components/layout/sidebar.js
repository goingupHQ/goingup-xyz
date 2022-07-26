import { useRouter } from "next/router";
import Link from "next/link";
import { Box, Stack, Button } from "@mui/material";

export default function Sidebar(props) {
    const commonButtonStyle = {
        fontSize: "16px",
        padding: "1px 25px",
    };

    const activeButtonStyle = {
        ...commonButtonStyle,
        backgroundColor: "sidebar.main",
        color: "primary.main",
        ":hover": {
            backgroundColor: "hoverPrimary.main",
            color: "background1.main",
        },
    };

    const inactiveButtonStyle = {
        ...commonButtonStyle,
        color: "#4D5F72",
        ":hover": {
            color: "primary.main",
        },
    };

    const router = useRouter();
    const { pathname } = router;

    return (
        <Box display={{ xs: "none", md: "initial" }}>
            <Stack
                direction='column'
                justifyContent='flex-start'
                alignItems='flex-start'
                sx={{
                    marginX: {
                        xs: "25px",
                    },
                }}
            >
                <Link href='/'>
                    <Button
                        sx={
                            pathname === "/"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        All Projects
                    </Button>
                </Link>
                <Link href='/openmetaverse'>
                    <Button
                        sx={
                            pathname === "/openmetaverse"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        Open Metaverse
                    </Button>
                </Link>
                <Link href='/daos'>
                    <Button
                        sx={
                            pathname === "/daos"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        DAOs
                    </Button>
                </Link>
                <Link href='/nfts'>
                    <Button
                        sx={
                            pathname === "/nfts"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        NFTs
                    </Button>
                </Link>
                <Link href='/defi'>
                    <Button
                        sx={
                            pathname === "/defi"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        DeFi
                    </Button>
                </Link>
                <Link href='/cryptoart'>
                    <Button
                        sx={
                            pathname === "/cryptoart"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        CryptoArt
                    </Button>
                </Link>
                <Link href='/audiovisual'>
                    <Button
                        sx={
                            pathname === "/audiovisual"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        Audio Visual
                    </Button>
                </Link>
                <Link href='/charities'>
                    <Button
                        sx={
                            pathname === "/charities"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        Charities
                    </Button>
                </Link>
                <Link href='/otherprojects'>
                    <Button
                        sx={
                            pathname === "/otherprojects"
                                ? activeButtonStyle
                                : inactiveButtonStyle
                        }
                    >
                        Other Projects
                    </Button>
                </Link>
            </Stack>
        </Box>
    );
}
