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
    const provider = await web3Modal.connect();
};

document.getElementById('mint-button').addEventListener('click', mint);
