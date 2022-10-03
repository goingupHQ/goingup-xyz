import { AppContext } from "../../../contexts/app-context";
import { WalletContext } from "../../../contexts/wallet-context";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    Fade,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import ChevronRightIcon from "../../icons/ChevronRightIcon";
import Router, { useRouter } from "next/router";

export default function SuggestedProfiles() {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!wallet.address) return;

        setLoading(true);
        fetch(`/api/get-potential-collaborators?address=${wallet.address}`)
            .then(async (response) => {
                const result = await response.json();
                setData(result);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [wallet.address]);

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Box>
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        paddingTop={"14px"}
                    >
                        <Typography variant='h2'>Suggested Profiles</Typography>
                        <Button
                            color={
                                app.mode === "dark" ? "primary" : "secondary"
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
                            View All Profiles
                        </Button>
                    </Stack>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Grid container>
                            {data.map((item) => {
                                return (
                                    <Card
                                        key={item.address}
                                        sx={{
                                            marginTop: "15px",
                                            ml: "none",
                                            mr: "15px",
                                            padding: "24px",
                                            width: { xs: "100%", md: "47%", lg:"31%" },
                                        }}
                                    >
                                        <Grid item>
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
                                                                    position:
                                                                        "relative",
                                                                    display:
                                                                        "inline-flex",
                                                                    backgroundColor:
                                                                        {
                                                                            xs: "none",
                                                                            md:
                                                                                app.mode ===
                                                                                "dark"
                                                                                    ? "#121E28"
                                                                                    : "#FFFFFF",
                                                                        },
                                                                    borderRadius:
                                                                        "50%",
                                                                    padding:
                                                                        "3px",
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        backgroundColor:
                                                                            app.mode ===
                                                                            "dark"
                                                                                ? "#121E28"
                                                                                : "#FFFFFF",
                                                                        borderRadius:
                                                                            "50%",
                                                                        padding:
                                                                            {
                                                                                xs: "17px",
                                                                                md: "none",
                                                                            },
                                                                        position:
                                                                            "absolute",
                                                                        marginTop:
                                                                            "8px",
                                                                        marginLeft:
                                                                            "8px",
                                                                    }}
                                                                />
                                                                <CircularProgress
                                                                    size={50}
                                                                    variant='determinate'
                                                                    sx={{
                                                                        position:
                                                                            "absolute",
                                                                        color:
                                                                            app.mode ===
                                                                            "dark"
                                                                                ? "#1D3042"
                                                                                : "#CFCFCF",
                                                                        padding:
                                                                            {
                                                                                xs: 1,
                                                                                sm: 1,
                                                                                md: 0,
                                                                            },
                                                                    }}
                                                                    thickness={
                                                                        7
                                                                    }
                                                                    value={100}
                                                                />
                                                                <CircularProgress
                                                                    size={50}
                                                                    thickness={
                                                                        7
                                                                    }
                                                                    variant='determinate'
                                                                    color='success'
                                                                    value={
                                                                        100 *
                                                                        (item.reputationScore /
                                                                            app.maxReputationScore)
                                                                    }
                                                                    sx={{
                                                                        color: "#3AB795",
                                                                        position:
                                                                            "relative",
                                                                        display:
                                                                            "inline-flex",
                                                                        padding:
                                                                            {
                                                                                xs: 1,
                                                                                sm: 1,
                                                                                md: 0,
                                                                            },
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
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        color={
                                                                            "#3AB795"
                                                                        }
                                                                        variant='rep'
                                                                    >
                                                                        {" "}
                                                                        {Math.round(
                                                                            100 *
                                                                                (item.reputationScore /
                                                                                    app.maxReputationScore)
                                                                        )}
                                                                        %
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    >
                                                        <Avatar
                                                            src={
                                                                item.profilePhoto
                                                            }
                                                            sx={{
                                                                width: {
                                                                    xs: 60,
                                                                    md: 114,
                                                                },
                                                                height: {
                                                                    xs: 60,
                                                                    md: 114,
                                                                },
                                                            }}
                                                        />
                                                    </Badge>
                                                }
                                                title={
                                                    <>
                                                        <Typography variant='h3'>
                                                            {item.name}
                                                        </Typography>
                                                        <Box>
                                                            <Typography
                                                                variant='sh1'
                                                                color='#6E8094'
                                                            >
                                                                {app.occupations.find(
                                                                    (o) =>
                                                                        o.id ==
                                                                        item.occupation
                                                                )?.text ||
                                                                    "None"}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                }
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Stack
                                                sx={{
                                                    border: 3,
                                                    borderColor:
                                                        app.mode === "dark"
                                                            ? "#253340"
                                                            : "#CFCFCF",
                                                    borderRadius: "8px",

                                                    backgroundColor:
                                                        app.mode === "dark"
                                                            ? "#253340"
                                                            : "#CFCFCF",
                                                }}
                                                direction='row'
                                                alignItems='center'
                                                justifyContent='space-between'
                                                marginBottom={"10px"}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            app.mode === "dark"
                                                                ? "#111921"
                                                                : "#F5F5F5",
                                                        borderRadius: "4px",

                                                        paddingY: { md: "5px" },
                                                        paddingBottom: "3px",
                                                        mx: "auto",
                                                        ml: "none",
                                                        paddingX: {xs: "50px", md: "20", lg: "10px"},
                                                    }}
                                                >
                                                    <Typography
                                                        variant='sh2'
                                                    >
                                                        {item.name
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s/g,
                                                                ""
                                                            ) + ".eth"}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant='sh2'
                                                    sx={{
                                                        mx: "auto",
                                                        paddingX: "10px",
                                                    }}
                                                >
                                                    {item.chain ===
                                                        "Ethereum" &&
                                                        truncateEthAddress(
                                                            item.address
                                                        )}
                                                    {item.chain != "Ethereum" &&
                                                        `Wallet Address`}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant='outlined'
                                                color='profileButton'
                                                sx={{
                                                    color:
                                                        app.mode === "dark"
                                                            ? "#FFFFFF"
                                                            : "#22272F",
                                                    width: "100%",
                                                }}
                                                onClick={() => {
                                                        router.push(`/profile/${item.address}`);
                                                    }}
                                            >
                                                <Typography variant='sh3'>
                                                    View Profile
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Card>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            </Fade>
        </>
    );
}
