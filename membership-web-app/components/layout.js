import { Box, Grid, Slide, Stack } from '@mui/material';
import Footer from './footer';

export default function Layout({ children }) {
    return (
        <>
            <Slide direction="up" in timeout={1500}>
                <Stack
                    spacing={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        pt: 5,
                    }}
                >
                    <Box
                        component="img"
                        src="/images/goingup-logo-dark.svg"
                        sx={{
                            width: '300px',
                            maxWidth: '300px',
                            marginLeft: '-3px'
                        }}
                    />

                    {children}

                    <Footer />
                </Stack>
            </Slide>
        </>
    );
}
