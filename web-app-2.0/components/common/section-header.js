import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';

export default function SectionHeader(props) {
    const { title, children } = props;
    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                <Typography variant="h2">{title}</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'initial', md: 'right' } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent={{ xs: 'initial', md: 'flex-end' }}
                    spacing={1}
                    sx={{ mt: { xs: 1, md: 'initial' }, mr: { xs: 'initial', md: 'initial' } }}
                >
                    {children}
                </Stack>
            </Grid>
        </Grid>
    );
}
