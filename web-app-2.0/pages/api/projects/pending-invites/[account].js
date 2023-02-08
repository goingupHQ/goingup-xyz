import { provider, contractAddress } from '../_provider';
import artifact from '../../../../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { account } = req.query;

    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const filter = contract.filters.InviteMember(null, null, account);
    filter.fromBlock = '0x1c548c0';
    filter.toBlock = 'latest';
    filter.address = contractAddress;
    const logs = await provider.getLogs(filter);
    // const projectIds = logs.map(log => parseInt(log.data, 16));

    res.send(logs);
}
