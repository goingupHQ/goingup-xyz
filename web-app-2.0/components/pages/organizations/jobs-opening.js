import React, { useContext } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { Card, Fade, Stack, Typography } from '@mui/material';

export default function JobsOpening(props) {
    const { account } = props;
    const app = useContext(AppContext);

    return (
        <>
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '50px',
                        backgroundColor: {
                            xs: app.mode === 'dark' ? '#0F151C' : '#FFFFFF',
                            md: app.mode === 'dark' ? '#111921' : '#F5F5F5',
                        },
                    }}>
                    <>
                        <Typography margin={4} variant='mobileh1'>
                            Jobs and role opening
                        </Typography>
                        <Stack
                            spacing={4}
                            paddingBottom={'30px'}
                            alignItems='center'
                            paddingX={'30px'}>
                            <img
                                src='/images/illustrations/empty-box.svg'
                                alt='connection-lost'
                                style={{
                                    width: '100%',
                                    maxWidth: '200px',
                                }}
                            />
                            <Typography variant='h2'>
                                {account.name} have no openings available
                            </Typography>
                        </Stack>
                    </>
                </Card>
            </Fade>
        </>
    );
}
