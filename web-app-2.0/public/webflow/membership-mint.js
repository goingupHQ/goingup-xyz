const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc';
const abi = ['function totalSupply() view returns (uint256)', 'function mint(bytes32[] memory proof) payable'];
const defaultProvider = ethers.providers.getDefaultProvider('homestead');
const contract = new ethers.Contract(contractAddress, abi, defaultProvider);

const loadSupplyCounter = async () => {
    const supply = await contract.totalSupply();
    const available = 222 - supply.toNumber();
    const supplyCounter = document.getElementById('supply-counter');
    supplyCounter.innerText = available === 0 ? `sold out` : `${available} out of 222 available`;
};

loadSupplyCounter();
setInterval(async () => {
    loadSupplyCounter();
}, 5000);

const Web3Modal = window.Web3Modal.default;
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
            darkMode: true
        },
    },
};

web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    theme: 'dark',
});

const mint = async () => {
    document.querySelector('.web3modal-modal-lightbox').style.zIndex = 10000;
    const web3ModalProvider = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(web3ModalProvider);

    const { chainId } = await provider.getNetwork();

    if (chainId !== 1) {
        alert('Please connect to the mainnet');
        return;
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const response = await fetch(
        `https://goingup-xyz-dev.vercel.app/api/admin/membership-nft/get-merkle-proof?address=${address}`
    );

    if (response.status === 200) {
        const merkleProof = await response.json();
        try {
            const signerContract = new ethers.Contract(contractAddress, abi, signer);
            const tx = await signerContract.mint(merkleProof, { value: ethers.utils.parseEther('2.22') });
            // const tx = await signerContract.mint(merkleProof, { value: 1000000  });
            alert(`Mint transaction submitted to the blockchain. Please monitor your wallet for transaction result.`);
        } catch (err) {
            console.log(err);
            if (err?.data?.originalError?.message === 'execution reverted: not whitelisted') {
                alert('You are not whitelisted to mint NFTs');
            } else {
                alert('Something went wrong. Please contact GoingUP support.');
            }
        }
    }
};

document.getElementById('mint-button').addEventListener('click', mint);
