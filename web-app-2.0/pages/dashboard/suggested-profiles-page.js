import React, { useContext } from "react";
import { AppContext } from "../../contexts/app-context";
import { WalletContext } from "../../contexts/wallet-context";
import {
    Card,
    CardHeader,
    Typography,
    Fade,
    Stack,
    Button,
    Box,
    Grid,
} from "@mui/material";
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";
import SuggestedProfiles from "../../components/pages/dashboard/suggested-profiles";

const SuggestedProfilesPage = () => {
    const wallet = useContext(WalletContext);
    const app = useContext(AppContext);

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        backgroundColor: {
                            xs: app.mode === "dark" ? "#0F151C" : "#FFFFFF",
                            md: app.mode === "dark" ? "#111921" : "#F5F5F5",
                        },
                    }}
                >
                    <CardHeader
                        title={
                            <>
                                <Stack
                                    direction='row'
                                    justifyContent='space-between'
                                    paddingTop={"14px"}
                                    paddingX={"14px"}
                                >
                                    <Typography variant='mobileh1'>
                                        Suggested Profiles
                                    </Typography>
                                    <Button
                                        color={
                                            app.mode === "dark"
                                                ? "primary"
                                                : "secondary"
                                        }
                                        endIcon={
                                            <ChevronRightIcon
                                                color={
                                                    app.mode === "dark"
                                                        ? "primary"
                                                        : "secondary"
                                                }
                                            />
                                        }
                                    >
                                        View All Profiles{" "}
                                    </Button>
                                </Stack>
                            </>
                        }
                    />
                    <Box sx={{ padding: 4 }}>
                        <Grid item xs={12} md={6}>
                            <SuggestedProfiles />
                        </Grid>
                    </Box>
                </Card>
            </Fade>
        </>
    );
};

export default SuggestedProfilesPage;
