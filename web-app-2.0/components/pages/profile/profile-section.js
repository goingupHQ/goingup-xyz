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
} from "@mui/material";
import ContactsAndIntegrations from "./contacts-and-integrations";

const ProfileSection = (props) => {

    const app = useContext(AppContext);
    const { account } = props;

    return (
        <>
            <Grid item xs={12}>
                <Fade in={true} timeout={1000}>
                    <Card>
                        <Grid container marginX={"30px"} marginY={"15px"}>
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
                                            <Chip
                                                variant='outlined'
                                                label={
                                                    app.occupations.find(
                                                        (o) =>
                                                            o.id ==
                                                            account.occupation
                                                    )?.text || "None"
                                                }
                                            />
                                            <Typography
                                                variant='h3'
                                                className='truncate-text'
                                            >
                                                Looking for:{" "}
                                                {account.idealCollab && (
                                                    <>
                                                        {account.idealCollab.map(
                                                            (item) => (
                                                                <Chip
                                                                    key={item}
                                                                    label={
                                                                        app.occupations.find(
                                                                            (
                                                                                o
                                                                            ) =>
                                                                                o.id ==
                                                                                item
                                                                        )?.text
                                                                    }
                                                                    variant='outlined'
                                                                />
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Typography>
                                        </>
                                    }
                                />
                            </Grid>
                            <Grid md={4} container alignItems='center'>
                                <ContactsAndIntegrations
                                    account={account}
                                    refresh={props.refresh}
                                />
                                <Typography>
                                    {account.address}
                                </Typography>
                            </Grid>
                            <Typography>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry&apos;s standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
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
