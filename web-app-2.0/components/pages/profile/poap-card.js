import { Button, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useContext } from 'react';
import { AppContext } from '../../../contexts/app-context';

export default function PoapCard(props) {
    const app = useContext(AppContext);
    const { poap } = props;

    const buttonStyle = {
        width: "63px",
        height: "24px",
        backgroundColor: app.mode === "dark" ? "#253340" : "#CFCFCF",
    };

    return (
        <>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                sx={{
                    backgroundColor: {
                        xs: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        md: app.mode === 'dark' ? '#19222C' : '#FFFFFF',
                    },
                    borderRadius: '8px',
                    padding: '15px',
                }}
            >
                <a href={poap.event.event_url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={poap.event.image_url}
                        alt=""
                        style={{
                            width: '120px',
                            height: '120px',
                        }}
                    />
                </a>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={0.5}
                    sx={{
                        paddingX: '15px',
                    }}
                >
                    <Typography
                        variant="mobileh2"
                        sx={{
                            paddingBottom: '20px',
                            paddingTop: '5px',
                        }}
                    >
                        {poap.event.name}
                    </Typography>
                    <Typography variant="sh3">{moment(poap.event.start_date).format('LL')}</Typography>

                    <Button
                        sx={{
                            color: app.mode === 'dark' ? '#FFFFFF' : '#22272F',
                        }}
                        size="small"
                        style={buttonStyle}
                    >
                        Creative
                    </Button>
                </Stack>
            </Stack>
        </>
    );
}
