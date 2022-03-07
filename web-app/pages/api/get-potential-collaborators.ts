import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address, count } = req.query;

    const db = await getDb();
    const accounts = await db.collection('accounts');
    const account = await accounts.findOne({ address });
    const { idealCollab } = account;

    const query = { idealCollab: { $in: idealCollab }};

    const queryResults = await accounts.aggregate([
        {$match: query},
        {$sample: {size: 5}}
    ]).toArray();

    res.json(queryResults);
}
