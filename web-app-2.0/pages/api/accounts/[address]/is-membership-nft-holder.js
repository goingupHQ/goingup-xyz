import { ethers } from 'ethers';
import artifact from '../../../../artifacts/GoingUpMembership.json';

export default async function handler(req, res) {
    const { address } = req.query;

    const contractAddress = '0x9337051505436D20FDCf7E2CE5a733b49d1042bc';
    const abi = artifact.abi;
    const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const balance = await contract.balanceOf(address);

    const isHolder = balance.gt(0);

    res.send({ balance: balance.toNumber(), isHolder });
}