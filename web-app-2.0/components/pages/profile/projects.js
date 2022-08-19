import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../../src/contexts/WalletContext';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    styled,
    Fade
} from '@mui/material';
import ProjectsList from '../../src/components/common/ProjectsList';

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

const Poaps = (props) => {
    const { projects } = props.account;

    const wallet = useContext(WalletContext);

    const { account } = props;
    const myAccount = wallet.address === account.address;

    return (
        <>
            <Grid item xs={12}>
                <Fade in={true} timeout={1000}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        <CardHeader
                            sx={{
                                px: 3,
                                pt: 3,
                                alignItems: 'flex-start'
                            }}
                            title={
                                <>
                                    <Typography variant="h1">
                                        Projects
                                    </Typography>
                                </>
                            }
                        />
                        <CardContentWrapper
                            sx={{
                                px: 3,
                                pt: 3
                            }}
                        >

                            <ProjectsList projects={account.projects} hideActions />
                        </CardContentWrapper>
                    </Card>
                </Fade>
            </Grid>
        </>
    )
}

export default Poaps;