import { Button, Grid, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import React from 'react';

export default function Home() {
    const modelRef = React.useRef();

    return (
        <Grid container spacing={3} sx={{ width: '100%', paddingX: { xs: 2, md: 6, lg: 12, xl: 22 }, pt: 4, pb: 16 }}>
            <Grid item xs={12} md={6} sx={{ px: 10 }}>
                <model-viewer
                    alt="GoingUP Exclusive Premium Membership Trophy"
                    src="https://storage.googleapis.com/goingup-xyz-bucket-001/assets/GoingUP-Trophy_GLB.glb"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    poster="https://storage.googleapis.com/goingup-xyz-bucket-001/assets/GoingUP_Trophy_Sq.png"
                    shadow-intensity="1"
                    auto-rotate
                    rotation-per-second="250%"
                    disable-zoom
                    camera-controls
                    style={{
                        height: 'auto',
                        minHeight: '500px',
                        width: '100%',
                        borderRadius: '4px',
                        border: `1px solid #fff`,
                    }}
                    ref={(ref) => {
                        modelRef.current = ref;
                    }}
                ></model-viewer>
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    px: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                    <strong>
                        Exclusive Premium Membership NFT
                    </strong>
                </Typography>

                <Typography variant="body1" sx={{ textAlign: 'center', color: '#AAADB3' }}>
                    COLLABORATION, AND REPUTATION BUILDING PLATFORM FOR PROFESSIONALS IN THE WEB3 ECOSYSTEM.
                </Typography>

                <Typography variant="h3" sx={{ textAlign: 'center', py: 4 }}>
                    <FontAwesomeIcon icon={faEthereum} /> <strong>2.22 ETH</strong>
                </Typography>

                <Button variant="contained" color="primary" size="large" sx={{ fontSize: '1.5rem', px: '3rem', py: '0.6rem' }}>
                    <strong>Mint Now</strong>
                </Button>
            </Grid>
        </Grid>
    );
}
