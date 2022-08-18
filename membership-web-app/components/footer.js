import { Box, Grid, Stack, Typography, Link, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';
import React from 'react';

export default function Footer(props) {
    return (
        <Grid
            container
            sx={{
                backgroundColor: 'rgba(92,49,255,0.99)',
                width: '100%',
                paddingY: 4,
                paddingX: { xs: 2, md: 6, lg: 12, xl: 22 },
            }}
            columnSpacing={4}
            rowSpacing={{ xs: 4, md: 2 }}
        >
            <Grid item xs={12} md={6}>
                <Box
                    component="img"
                    src="/images/goingup-logo-dark.svg"
                    sx={{
                        width: '300px',
                        maxWidth: '300px',
                        marginTop: '10px',
                    }}
                />
                <Typography variant="h6">The web3 professional community for high-potential builders.</Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Typography variant="h4">Create your web3-native profile. No crypto experience needed.</Typography>

                <Typography variant="h6">
                    Join thousands of professionals and builders creating the future of web3.
                </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">
                                <strong>Project</strong>
                            </Typography>

                            <Typography variant="body1">
                                <Link href="https://goingup.xyz/about" rel="noopener noreferrer" target="_blank">
                                    About
                                </Link>
                            </Typography>

                            <Typography variant="body1">
                                <Link href="https://medium.com/try-goingup" rel="noopener noreferrer" target="_blank">
                                    Blog
                                </Link>
                            </Typography>

                            <Typography variant="body1">
                                <Link href={null} rel="noopener noreferrer" target="_blank">
                                    Partnerships
                                </Link>
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={6}>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">
                                <strong>Help</strong>
                            </Typography>

                            <Typography variant="body1">
                                <Link href="https://goingup.xyz/nft-membership#FAQ" rel="noopener noreferrer" target="_blank">
                                    FAQ
                                </Link>
                            </Typography>

                            <Typography variant="body1">
                                <Link href={null} rel="noopener noreferrer" target="_blank">
                                    Terms of Service
                                </Link>
                            </Typography>

                            <Typography variant="body1">
                                <Link href="https://goingup.xyz/privacypolicy" rel="noopener noreferrer" target="_blank">
                                    Privacy Policy
                                </Link>
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={12} sx={{ mt: 4, mb: 2 }}>
                <Divider />
            </Grid>

            <Grid item xs={6}>
                <Typography variant="body1">
                    © 2022 UP Protocol Inc.
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Stack direction="row" spacing={3} justifyContent="end">
                    <Link href="https://twitter.com/GoingupHQ" rel="noopener noreferrer" target="_blank">
                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                    </Link>

                    <Link href="https://discord.com/invite/KPVZ" rel="noopener noreferrer" target="_blank">
                        <FontAwesomeIcon icon={faDiscord} size="lg" />
                    </Link>

                    <Link href={null} rel="noopener noreferrer" target="_blank">
                        <FontAwesomeIcon icon={faTelegram} size="lg" />
                    </Link>

                    <Link href={null} rel="noopener noreferrer" target="_blank">
                        <FontAwesomeIcon icon={faGithub} size="lg" />
                    </Link>
                </Stack>
            </Grid>
        </Grid>
    );
}
