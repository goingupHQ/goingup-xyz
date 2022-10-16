import { getDb } from '../../_get-db-client';

export default async (req, res) => {
    const { txhash } = req.query;
    const db = await getDb();

    if (req.method === 'GET') {
        const reward = await db.collection('project-reward-txs').findOne({ txhash });
        res.status(200).json(reward);
    }

    if (req.method === 'POST') {
        const reward = await db.collection('project-reward-txs').findOne({ txhash });

        if (reward) {
            res.status(409).json({ message: 'Reward already exists' });
            return;
        }

        console.log('req.body:', req.body);
        const { projectId, member, memberRecordId, tokenId, amount, type } = req.body;

        await db.collection('project-reward-txs').insertOne({
            txhash,
            projectId,
            member,
            memberRecordId,
            tokenId,
            amount,
            type,
            verified: false,
        });

        res.status(200).json({ message: 'Reward created' });
    }
};
