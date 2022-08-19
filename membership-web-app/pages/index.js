import { Button, Grid, Typography, Backdrop, Stack, Paper, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3Modal from 'web3modal';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import truncateEthAddress from 'truncate-eth-address';

export default function Home() {
    const { enqueueSnackbar } = useSnackbar();

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
    const [userAddress, setUserAddress] = useState(null);

    const mint = async () => {
        setMinting(true);
        setMintStep(0);

        try {
            const providerOptions = {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        infuraId: '86d5aa67154b4d1283f804fe39fcb07c',
                    },
                },
                coinbasewallet: {
                    package: CoinbaseWalletSDK,
                    options: {
                        appName: 'GoingUP Exclusive Premium Membership NFT',
                        infuraId: '86d5aa67154b4d1283f804fe39fcb07c',
                        chainId: 1,
                        darkMode: true,
                    },
                },
            };

            const web3Modal = new Web3Modal({
                cacheProvider: false,
                providerOptions,
                theme: 'dark',
            });

            await sleep(1000);
            const web3ModalProvider = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(web3ModalProvider);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            setUserAddress(address);
            setMintStep(1);
            await sleep(1000);
            const { chainId } = await provider.getNetwork();

            if (chainId !== 1) {
                throw 'Please switch to Ethereum Mainnet';
            }

            setMintStep(2);
            await sleep(1000);
            const response = await fetch(
                `https://goingup-xyz-dev.vercel.app/api/admin/membership-nft/get-merkle-proof?address=${address}`
            );

            if (response.status === 200) {
                const merkleProof = await response.json();
                try {
                    setMintStep(3);
                    const signerContract = new ethers.Contract(contractAddress, abi, signer);
                    const tx = await signerContract.mint(merkleProof, { value: ethers.utils.parseEther('2.22') });
                    // const tx = await signerContract.mint(merkleProof, { value: 1000000 });
                    enqueueSnackbar(
                        `Mint transaction submitted to the blockchain. Please monitor your wallet for transaction result.`,
                        { variant: 'success' }
                    );
                } catch (err) {
                    const message = err.message;
                    console.log('error message', message);
                    if (message.includes('execution reverted: not whitelisted')) {
                        throw 'You are not whitelisted to mint';
                    } else if (message.includes('insufficient funds')) {
                        throw 'You do not have enough ether to mint';
                    } else if (message.includes('Modal closed by user')) {
                        console.log('Modal closed by user');
                    } else {
                        throw 'Something went wrong. Please contact GoingUP support.';
                    }
                }
            } else {
                throw 'Could not fetch whitelist proof';
            }
        } catch (err) {
            if (typeof err === 'string') enqueueSnackbar(err, { variant: 'error' });
            else if (typeof err.message === 'string') enqueueSnackbar(err.message, { variant: 'error' });
            console.log(err);
        } finally {
            setMinting(false);
        }
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const checkmark = <CheckCircleOutlinedIcon sx={{ color: 'lightgreen', marginX: 1, fontSize: '18pt' }} />;
    const progress = <CircularProgress size="18px" sx={{ marginX: 1 }} />;

    return (
        <>
            <Grid
                container
                spacing={3}
                sx={{ width: '100%', paddingX: { xs: 2, md: 6, lg: 12, xl: 22 }, pt: 4, pb: 16 }}
            >
                <Grid item xs={12} md={6} sx={{ px: 10 }}>
                    <model-viewer
                        alt="GoingUP Exclusive Premium Membership Trophy"
                        src="https://storage.googleapis.com/goingup-xyz-bucket-001/assets/GoingUP-Trophy_GLB.glb"
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
                        {!fetchedAvailableSupply
                            ? `Fetching available supply...`
                            : availableSupply === 0
                            ? `Sold Out`
                            : `${availableSupply} out of 222 available`}
                    </Typography>
                </Grid>
            </Grid>

            <Backdrop open={minting}>
                <Paper sx={{ padding: 6 }}>
                    <Stack direction="column" spacing={3}>
                        <Typography variant="h5">
                            1. Connect User Wallet
                            {userAddress ? ` (${truncateEthAddress(userAddress)})` : ''}
                            {mintStep === 0 && progress}
                            {mintStep > 0 && checkmark}
                        </Typography>
                        <Typography variant="h5">
                            2. Check Network
                            {mintStep === 1 && progress}
                            {mintStep > 1 && checkmark}
                        </Typography>
                        <Typography variant="h5">
                            3. Get Whitelist Merkle Proof
                            {mintStep === 2 && progress}
                            {mintStep > 2 && checkmark}
                        </Typography>
                        <Typography variant="h5">
                            4. Minting
                            {mintStep === 3 && progress}
                            {mintStep > 3 && checkmark}
                        </Typography>
                    </Stack>
                </Paper>
            </Backdrop>
        </>
    );
}
