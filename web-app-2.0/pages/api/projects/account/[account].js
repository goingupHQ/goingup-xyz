import { provider, contractAddress } from '../_provider';
import artifact from '../../../../artifacts/GoingUpProjects.json';
import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { account } = req.query;

    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const filter = contract.filters.Create(account);
    filter.fromBlock = 0;
    filter.toBlock = 'latest';
    const logs = await provider.getLogs(filter);
    const projectIds = logs.map(log => parseInt(log.data, 16)); console.log('projectIds', projectIds);

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
