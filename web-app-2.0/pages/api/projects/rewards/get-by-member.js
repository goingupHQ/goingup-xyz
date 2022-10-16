import { getDb } from '../../_get-db-client';

export default async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { projectId, member } = req.query;
    const db = await getDb();

    const unverified = await db.collection('project-reward-txs').find({ projectId, member, verified: false }).toArray();
    const verified = await db.collection('project-reward-txs').find({ projectId, member, verified: true }).toArray();
    res.status(200).json({ unverified, verified });
}