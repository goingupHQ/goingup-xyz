// const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc'; // mainnet
// const defaultProvider = ethers.providers.getDefaultProvider('homestead'); // mainnet
// const requiredNetwork = 1; // mainnet

const contractAddress = '0x492a13A2624140c75025be03CD1e46ecF15450F5'; // goerli
const requiredNetwork = 5; // goerli

const defaultProvider = ethers.providers.getDefaultProvider(requiredNetwork);
const abi = ['function totalSupply() view returns (uint256)', 'function mint(bytes32[] memory proof) payable'];
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

const disableMintButton = () => {
    const mintButton = document.getElementById('mint-button');
    mintButton.style.opacity = 0.5;
    mintButton.style.pointerEvents = 'none';
    mintButton.innerText = 'Just a sec, minting...';
}

const enableMintButton = () => {
    const mintButton = document.getElementById('mint-button');
    mintButton.style.opacity = 1;
    mintButton.style.pointerEvents = 'auto';
    mintButton.innerText = 'Mint Now';
}

const mint = async () => {
    disableMintButton();

    try {
        document.querySelector('.web3modal-modal-lightbox').style.zIndex = 10000;
        const web3ModalProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);

        const { chainId } = await provider.getNetwork();

        if (chainId !== requiredNetwork) {
            alert(`Please switch to ${requiredNetwork === 1 ? 'Ethereum Mainnet' : 'Goerli Testnet'}`);
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
                const message = err.message;
                console.log('error message', message);
                if (message.includes('execution reverted: not whitelisted')) {
                    alert('You are not whitelisted to mint');
                } else if (message.includes('insufficient funds')) {
                    alert('You do not have enough ether to mint');
                } else if (message.includes('Modal closed by user')) {
                    console.log('Modal closed by user');
                } else {
                    alert('Something went wrong. Please contact GoingUP support.');
                }
            }
        }
    } catch (err) {
        console.log(err);
        alert('Something went wrong. Please contact GoingUP support.');
    } finally {
        enableMintButton();
    }
};

document.getElementById('mint-button').addEventListener('click', mint);
