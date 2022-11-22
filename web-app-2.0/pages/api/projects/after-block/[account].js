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
    filter.address = contractAddress;
    const logs = await provider.getLogs(filter);
    const projectIds = logs.map(log => parseInt(log.data, 16));

    const projects = await Promise.all(projectIds.map(async projectId => {
        const projectRecord = await contract.projects(projectId);
        return {
            id: projectId,
            name: projectRecord.name,
            description: projectRecord.description,
            started: projectRecord.started,
            ended: projectRecord.ended,
            primaryUrl: projectRecord.primaryUrl,
            tags: projectRecord.tags,
            owner: projectRecord.owner,
            active: projectRecord.active,
            isPrivate: projectRecord.isPrivate,
        }
    }));

    res.send(projects);
}
