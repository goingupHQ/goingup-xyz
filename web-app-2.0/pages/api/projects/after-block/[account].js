import { provider, contractAddress } from '../_provider';
import artifact from '../../../../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { account, block } = req.query;

    if (!account) return res.status(400).send('No account specified');
    if (!block) return res.status(400).send('No block specified');
    if (isNaN(parseInt(block))) return res.status(400).send('Block must be a number');

    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const filter = contract.filters.Create(account);
    filter.fromBlock = parseInt(block);
    filter.toBlock = 'latest';
    const logs = await provider.getLogs(filter);
    const projectIds = logs.map(log => parseInt(log.data, 16));

    res.send(projectIds);
}
