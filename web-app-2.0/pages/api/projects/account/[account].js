import { BigNumber } from 'ethers';
import { getDb } from '../../_get-db-client';

export default async function handler(req, res) {
    const { account } = req.query;
    const db = await getDb();

    const projects = await db.collection('goingup-projects').find({ owner: account }).toArray();

    for (const project of projects) {
        const id = project.id;
        const bn = BigNumber.from(id._hex);
        project.id = bn.toNumber();
    }

    res.send(projects);
}
