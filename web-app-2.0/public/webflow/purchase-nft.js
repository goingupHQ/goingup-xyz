// const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc'; // mainnet
// const defaultProvider = ethers.providers.getDefaultProvider('homestead'); // mainnet
// const requiredNetwork = 1; // mainnet

const contractAddress = '0x492a13A2624140c75025be03CD1e46ecF15450F5'; // goerli
const requiredNetwork = 5; // goerli

const defaultProvider = ethers.providers.getDefaultProvider(requiredNetwork);
const abi = [
    'function totalSupply() view returns (uint256)',
    'function mint(bytes32[] memory proof) payable',
    'function balanceOf(address) view returns (uint256)',
];
const contract = new ethers.Contract(contractAddress, abi, defaultProvider);

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const account = params.account || 'main';

const accounts = {
    main: {
        address: '0xff188235879FA2dB8438802e399Ed31CaB0F61E4',
    },
    emmanuel: {
        address: '0xa96e945fd471C67B16D138b59Cc8abA4E8171b00',
    },
    anbessa: {
        address: '0xD8A1330988e89e20b9FFa1739E3F85c9cBa8eF51',
    },
    ebae: {
        address: '0xfCdFa41fA58AA9c5E4ef76FDd709c8E10dd3Bb42',
    },
};

const accountAddress = accounts[account]?.address;

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
            darkMode: true,
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
    mintButton.innerText = 'Just a sec, processing...';
};

const enableMintButton = () => {
    const mintButton = document.getElementById('mint-button');
    mintButton.style.opacity = 1;
    mintButton.style.pointerEvents = 'auto';
    mintButton.innerText = 'Buy NFT Now';
};

const mint = async () => {
    disableMintButton();

    try {
        if (!accountAddress) throw `Invalid account`;
        document.querySelector('.web3modal-modal-lightbox').style.zIndex = 10000;
        const web3ModalProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);

        const { chainId } = await provider.getNetwork();

        if (chainId !== requiredNetwork) {
            throw `Wrong network. Please switch to ${requiredNetwork === 1 ? 'Ethereum Mainnet' : 'Goerli Testnet'}.`;
        }

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const accountBalance = await contract.balanceOf(accountAddress);
        if (accountBalance.eq(0)) {
            throw `Sold out. This account has run out of tokens.`;
        }

        const tx = await signer.sendTransaction({
            to: accountAddress,
            value: ethers.utils.parseEther('0.1')
        });
    } catch (err) {
        if (typeof err === 'string') {
            alert(err);
        } else {
            console.log(err);
            alert('Something went wrong. Please contact GoingUP support.');
        }
    } finally {
        enableMintButton();
    }
};

document.getElementById('mint-button').addEventListener('click', mint);
