import React, { useContext } from "react";
import { AppContext } from "../../../contexts/app-context";
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    Fade,
    Avatar,
    Stack,
    Box,
    CircularProgress,
    Badge,
    Button,
} from "@mui/material";
import ContactsAndIntegrations from "./contacts-and-integrations";
import { useTheme } from "@mui/material";

const ProfileSection = (props) => {
    const app = useContext(AppContext);
    const { account } = props;
    const theme = useTheme();

    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems='center'
                justifyContent='space-between'
            >
                <Fade in={true} timeout={1000}>
                    <Card>
                        <Grid item container paddingX={"15px"} marginY={"15px"}>
                            <Grid md={8}>
                                <CardHeader
                                    avatar={
                                        <Badge
                                            overlap='circular'
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                            }}
                                            badgeContent={
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        display: "inline-flex",
                                                        backgroundColor:
                                                            app.mode === "dark"
                                                                ? "#121E28"
                                                                : "#FFFFFF",
                                                        borderRadius: "20px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    <CircularProgress
                                                        variant='determinate'
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            color:
                                                                app.mode ===
                                                                "dark"
                                                                    ? "#1D3042"
                                                                    : "#CFCFCF",
                                                        }}
                                                        size={50}
                                                        thickness={7}
                                                        value={100}
                                                    />
                                                    <CircularProgress
                                                        thickness={7}
                                                        size={50}
                                                        variant='determinate'
                                                        color='success'
                                                        value={
                                                            100 *
                                                            (account.reputationScore /
                                                                app.maxReputationScore)
                                                        }
                                                        sx={{
                                                            color: "#3AB795",
                                                            position:
                                                                "relative",
                                                            display:
                                                                "inline-flex",
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            top: 0,
                                                            left: 0,
                                                            bottom: 0,
                                                            right: 0,
                                                            position:
                                                                "absolute",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            color={"#3AB795"}
                                                            variant='caption'
                                                        >
                                                            {" "}
                                                            {Math.round(
                                                                100 *
                                                                    (account.reputationScore /
                                                                        app.maxReputationScore)
                                                            )}
                                                            %
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        >
                                            <Avatar
                                                src={account.profilePhoto}
                                                sx={{
                                                    width: 114,
                                                    height: 114,
                                                }}
                                            />
                                        </Badge>
                                    }
                                    title={
                                        <>
                                            <Typography variant='h1'>
                                                {account.name}
                                            </Typography>
                                            <Typography>
                                                {app.occupations.find(
                                                    (o) =>
                                                        o.id ==
                                                        account.occupation
                                                )?.text || "None"}
                                            </Typography>
                                            <Typography
                                                variant='p'
                                                color='#6E8094'
                                            >
                                                Looking for:{" "}
                                                {account.idealCollab && (
                                                    <>
                                                        {account.idealCollab.map(
                                                            (item) => (
                                                                <Button
                                                                    variant='secondary'
                                                                    key={item}
                                                                >
                                                                    {
                                                                        app.occupations.find(
                                                                            (
                                                                                o
                                                                            ) =>
                                                                                o.id ==
                                                                                item
                                                                        )?.text
                                                                    }
                                                                </Button>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Typography>
                                        </>
                                    }
                                />
                            </Grid>
                            <Grid md={4}>
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    justifyContent={{
                                        xs: "none",
                                        md: "flex-end",
                                    }}
                                    marginY={"15px"}
                                >
                                    <ContactsAndIntegrations
                                        account={account}
                                        refresh={props.refresh}
                                    />
                                </Stack>
                                <Stack
                                    direction='row'
                                    spacing={2}
                                    alignItems='center'
                                    justifyContent='flex-end'
                                    marginY={"15px"}
                                >
                                    <Typography
                                        sx={{
                                            backgroundColor:
                                                app.mode === "dark"
                                                    ? "#253340"
                                                    : "#CFCFCF",
                                        }}
                                    >
                                        {account.address}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est laborum.
                            </Typography>
                        </Grid>
                    </Card>
                </Fade>
            </Grid>
        </>
    );
};

export default ProfileSection;
