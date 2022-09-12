import { Box, LinearProgress, Stack } from '@mui/material';
import React from 'react';

export default function LoadingIllustration(props) {
    return (
        <>
            <Stack direction="column" spacing={2} alignItems="center">
                <Box
                    component="img"
                    src="/images/illustrations/loading.svg"
                    alt="Processing"
                    sx={{ width: '100%', maxWidth: '500px' }}
                />
                <Box sx={{ width: '100%', maxWidth: '500px' }}>
                    <LinearProgress variant="indeterminate" />
                </Box>
            </Stack>
        </>
    );
}
