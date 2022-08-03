export default async function handler(req, res) {
    const { address } = req.query;
    // const alchemyProvider = new ethers.providers.AlchemyProvider(1, process.env.ALCHEMY_KEY);

    // const abi = [
    //     'function balanceOf(address owner) view returns (uint balance)'
    // ];
    // const contractAddress = `0x22C1f6050E56d2876009903609a2cC3fEf83B415`;
    // const contract = new ethers.Contract(address, abi, alchemyProvider);

    // const balanceOf = await contract.balanceOf(address);

    // res.send({balanceOf})

    res.send({});
}
