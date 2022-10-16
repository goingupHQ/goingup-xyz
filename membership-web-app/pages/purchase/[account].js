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
import { useRouter } from 'next/dist/client/router';

export default function Purchase() {
    const router = useRouter();
    const { account } = router.query;

    const accounts = {
        main: {
            address: '0xff188235879FA2dB8438802e399Ed31CaB0F61E4',
        },
        heather: {
            address: '0xa96e945fd471C67B16D138b59Cc8abA4E8171b00',
        },
        jack: {
            address: '0xD8A1330988e89e20b9FFa1739E3F85c9cBa8eF51',
        },
        // emmanuel: {
        //     address: '0xa96e945fd471C67B16D138b59Cc8abA4E8171b00',
        // },
        // anbessa: {
        //     address: '0xD8A1330988e89e20b9FFa1739E3F85c9cBa8eF51',
        // },
        // ebae: {
        //     address: '0xfCdFa41fA58AA9c5E4ef76FDd709c8E10dd3Bb42',
        // },
    };

    const accountAddress = accounts[account]?.address;

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [availableSupply, setAvailableSupply] = useState(0);
    const [fetchedAvailableSupply, setFetchedAvailableSupply] = useState(false);

    // mainnet
    const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc';
    const requiredNetwork = 1;

    // goerli
    // const contractAddress = '0x492a13A2624140c75025be03CD1e46ecF15450F5';
    // const requiredNetwork = 5;

    const defaultProvider = ethers.providers.getDefaultProvider(requiredNetwork);

    const abi = [
        'function totalSupply() view returns (uint256)',
        'function mint(bytes32[] memory proof) payable',
        'function balanceOf(address) view returns (uint256)',
    ];

    const loadSupplyCounter = async () => {
        if (contractAddress && accountAddress) {
            const contract = new ethers.Contract(contractAddress, abi, defaultProvider);
            const available = await contract.balanceOf(accountAddress);
            setAvailableSupply(available);
            setFetchedAvailableSupply(true);
        }
    };

    const modelRef = React.useRef();

    let supplyCounterInterval = null;
    useEffect(() => {
        if (contractAddress && accountAddress) {
            if (supplyCounterInterval) clearInterval(supplyCounterInterval);
            supplyCounterInterval = setInterval(async () => {
                loadSupplyCounter();
            }, 2000);
        }
    }, [contractAddress, accountAddress]);

    const [minting, setMinting] = useState(false);
    const [mintStep, setMintStep] = useState(0);
    const [userAddress, setUserAddress] = useState(null);

    const mint = async () => {
        closeSnackbar();
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
            const contract = new ethers.Contract(contractAddress, abi, signer);

            setUserAddress(address);
            setMintStep(1);
            await sleep(1000);
            const { chainId } = await provider.getNetwork();

            if (chainId !== requiredNetwork) {
                throw `Wrong network. Please switch to ${
                    requiredNetwork === 1 ? 'Ethereum Mainnet' : 'Goerli Testnet'
                }.`;
            }

            setMintStep(2);
            await sleep(1000);
            const latestAvailable = await contract.balanceOf(accountAddress);

            if (latestAvailable.eq(0)) throw 'This sale has sold out.';

            setMintStep(3);
            await sleep(1000);
            const tx = await signer.sendTransaction({
                to: accountAddress,
                value: ethers.utils.parseEther('2.2'),
            });

            setMintStep(4);
            await sleep(1000);
            const receipt = await provider.waitForTransaction(tx.hash);

            setMintStep(5);
            await sleep(1000);
            const claimResponse = await fetch(
                `https://goingup-xyz-v2.vercel.app/api/admin/membership-nft/purchase?account=${account}&txhash=${tx.hash}`
            );

            if (claimResponse.status !== 200) throw 'Something went wrong. Please contact GoingUP support.';
            const result = await claimResponse.json(); console.log(result)
            const claimTx = await provider.getTransaction(result.hash);

            setMintStep(6);
            await sleep(1000);
            // const claimReceipt = await claimTx.wait();
            const claimReceipt = await provider.waitForTransaction(result.hash);

            setMintStep(7);
        } catch (err) {
            if (typeof err === 'string') enqueueSnackbar(err, { variant: 'error' });
            else if (typeof err.message === 'string') {
                console.log(err.message);
                if (err.message.startsWith('insufficient funds')) {
                    enqueueSnackbar('Sorry you do not have enough ETH in your wallet', { variant: 'error' });
                } else {
                    enqueueSnackbar(err.message, { variant: 'error' });
                }
            } else if (typeof err.reason === 'string') enqueueSnackbar(err.reason, { variant: 'error' });
            else enqueueSnackbar('Something went wrong. Please contact GoingUP support.', { variant: 'error' });

            console.log(err);
            setMinting(false);
        }
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const checkmark = <CheckCircleOutlinedIcon sx={{ color: 'lightgreen', marginX: 1, fontSize: '18pt' }} />;
    const progress = <CircularProgress size="18px" sx={{ marginX: 1 }} />;

    const stepActiveColor = '#FFFFFF';
    const stepInactiveColor = 'gray';

    return (
        <>
            <Grid container sx={{ width: '100%', paddingX: { xs: 4, md: 6, lg: 12, xl: 22 }, pt: 4, pb: 16 }}>
                <Grid item xs={12} md={6} sx={{ px: { sm: 4, md: 10 }, mb: { xs: 4, md: 0 } }}>
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
                            border: `1px solid #E2E5DE`,
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
                        px: { sm: 4, md: 10 },
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
                        <strong>Purchase NFT</strong>
                    </Button>

                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#AAADB3' }}>
                        {!fetchedAvailableSupply
                            ? `Fetching available supply...`
                            : availableSupply.eq(0)
                            ? `Sold Out`
                            : `${availableSupply} out of 222 available`}
                    </Typography>
                </Grid>
            </Grid>

            <Backdrop open={minting}>
                <Paper sx={{ padding: 6 }}>
                    <Stack direction="column" spacing={3} alignItems="center">
                        <Typography variant="h6" sx={{ color: mintStep >= 0 ? stepActiveColor : stepInactiveColor }}>
                            1. Connect User Wallet
                            {userAddress ? ` (${truncateEthAddress(userAddress)})` : ''}
                            {mintStep === 0 && progress}
                            {mintStep > 0 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 1 ? stepActiveColor : stepInactiveColor }}>
                            2. Check Network
                            {mintStep === 1 && progress}
                            {mintStep > 1 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 2 ? stepActiveColor : stepInactiveColor }}>
                            3. Check Available Tokens
                            {mintStep === 2 && progress}
                            {mintStep > 2 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 3 ? stepActiveColor : stepInactiveColor }}>
                            4. Send 2.2 ETH Payment
                            {mintStep === 3 && progress}
                            {mintStep > 3 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 4 ? stepActiveColor : stepInactiveColor }}>
                            5. Wait For Payment Confirmation
                            {mintStep === 4 && progress}
                            {mintStep > 4 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 5 ? stepActiveColor : stepInactiveColor }}>
                            6. Claim Membership NFT
                            {mintStep === 5 && progress}
                            {mintStep > 5 && checkmark}
                        </Typography>

                        <Typography variant="h6" sx={{ color: mintStep >= 6 ? stepActiveColor : stepInactiveColor }}>
                            7. Wait For NFT Transfer Confirmation
                            {mintStep === 6 && progress}
                            {mintStep > 6 && checkmark}
                        </Typography>

                        {mintStep < 7 && (
                            <Typography variant="body1" sx={{ color: 'gold' }}>
                                <strong>Please do not close this tab</strong>
                            </Typography>
                        )}

                        {mintStep === 7 && (
                            <>
                                <Typography variant="h6" sx={{ color: 'gold' }}>
                                    <strong>Your membership NFT has been transferred to your wallet!</strong>
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    onClick={() => setMinting(false)}
                                >
                                    <strong>Close</strong>
                                </Button>
                            </>
                        )}
                    </Stack>
                </Paper>
            </Backdrop>
        </>
    );
}
