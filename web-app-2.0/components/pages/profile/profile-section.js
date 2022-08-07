import React, { useContext } from "react";
import { AppContext } from "../../../contexts/app-context";
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    Fade,
    Chip,
    Avatar,
    Stack,
} from "@mui/material";
import ContactsAndIntegrations from "./contacts-and-integrations";

const ProfileSection = (props) => {
    const app = useContext(AppContext);
    const { account } = props;

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
                        <Grid item container paddingX={"30px"} marginY={"30px"}>
                            <Grid md={8}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={account.profilePhoto}
                                            sx={{
                                                width: 128,
                                                height: 128,
                                            }}
                                            variant='rounded'
                                        />
                                    }
                                    title={
                                        <>
                                            <Typography
                                                variant='h1'
                                                className='truncate-text'
                                            >
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
                                                                <Typography
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
                                                                </Typography>
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
                                    spacing={2}
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
                                    <Typography>{account.address}</Typography>
                                </Stack>
                            </Grid>
                            <Typography>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry&apos;s standard dummy text ever
                                since the 1500s, when an unknown printer took a
                                galley of type and scrambled it to make a type
                                specimen book. It has survived not only five
                                centuries, but also the leap into electronic
                                typesetting, remaining essentially unchanged. It
                                was popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum.
                            </Typography>
                        </Grid>
                    </Card>
                </Fade>
            </Grid>
        </>
    );
};

export default ProfileSection;
