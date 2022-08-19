import { Button, Grid, Typography, Backdrop, Stack, Paper, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

export default function Home() {
    const [availableSupply, setAvailableSupply] = useState(0);
    const [fetchedAvailableSupply, setFetchedAvailableSupply] = useState(false);

    const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc';
    const abi = ['function totalSupply() view returns (uint256)', 'function mint(bytes32[] memory proof) payable'];
    const defaultProvider = ethers.providers.getDefaultProvider('homestead');

    const loadSupplyCounter = async () => {
        const contract = new ethers.Contract(contractAddress, abi, defaultProvider);
        const supply = await contract.totalSupply();
        const available = 222 - supply.toNumber();
        setAvailableSupply(available);
        setFetchedAvailableSupply(true);
    };

    const modelRef = React.useRef();

    useEffect(() => {
        setInterval(async () => {
            loadSupplyCounter();
        }, 2000);
    }, []);

    const [minting, setMinting] = useState(false);
    const [mintStep, setMintStep] = useState(0);

    const mint = async () => {
        setMinting(true);
        setMintStep(0);

        try {

        } catch (err) {
            console.log(err);
        } finally {
            setMinting(false);
        }
    };

    return (
        <>
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
                        gap: 2,
                    }}
                >
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                        <strong>Exclusive Premium Membership NFT</strong>
                    </Typography>

                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#AAADB3' }}>
                        COLLABORATION, AND REPUTATION BUILDING PLATFORM FOR PROFESSIONALS IN THE WEB3 ECOSYSTEM.
                    </Typography>

                    <Typography variant="h3" sx={{ textAlign: 'center', py: 4 }}>
                        <FontAwesomeIcon icon={faEthereum} /> <strong>2.22 ETH</strong>
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ fontSize: '1.5rem', px: '3rem', py: '0.6rem' }}
                        disabled={minting}
                        onClick={mint}
                    >
                        <strong>Mint Now</strong>
                    </Button>

                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#AAADB3' }}>
                        {!fetchedAvailableSupply ?
                            `Fetching available supply...` :
                            availableSupply === 0 ? `Sold Out` : `${availableSupply} out of 222 available`
                        }
                    </Typography>
                </Grid>
            </Grid>
            <Backdrop open>
                <Paper sx={{ padding: 6 }}>
                    <Stack direction="column" spacing={3}>
                        <Typography variant="h4" sx={{ textAlign: 'center' }}>
                            1. Connecting Wallet
                            {mintStep === 0 &&
                            <CircularProgress size="24px" sx={{ marginX: 2 }} />
                            }
                        </Typography>
                    </Stack>
                </Paper>
            </Backdrop>
        </>
    );
}
