import { ethers } from 'ethers';
import { contractAddress, provider } from './_provider';
import { getDb } from '../_get-db-client';
import artifact from '../../../artifacts/GoingUpProjects.json';

export default async function handler(req, res) {
    const db = await getDb();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

    let i = 1;
    while (true) {
        const project = await contract.projects(i);
        if (project.id == 0) {
            break;
        }

        await db.collection('goingup-projects').updateOne(
            { id: project.id },
            {
                $set: {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    started: project.started,
                    ended: project.ended,
                    primaryUrl: project.primaryUrl,
                    tags: project.tags,
                    owner: project.owner,
                    active: project.active,
                    isPrivate: project.isPrivate,
                },
            },
            { upsert: true }
        );

        i++;
    }

    res.status(200).json({ message: 'ok' });
}
