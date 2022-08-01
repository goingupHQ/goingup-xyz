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
};

web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    theme: 'dark'
});

const mint = async () => {
    console.log('hello');
    const web3ModalProvider = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(web3ModalProvider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const response = await fetch(`https://goingup-xyz-dev.vercel.app/api/admin/membership-nft/get-merkle-proof?address=${address}`)

    if (response.status === 200) {
        const merkleProof = await response.json();
        const tx = await contract.mint(merkleProof);
        alert(`Mint transaction submitted to the blockchain. Please monitor your wallet for transaction result.`);
    }
};

document.getElementById('mint-button').addEventListener('click', mint);
