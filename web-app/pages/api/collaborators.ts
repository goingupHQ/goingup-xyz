import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { open_to, count } = req.query;
    const parsed = open_to ? open_to.split(',') : [];
    const openToArray = parsed.map(i => parseInt(i));

    const db = await getDb();
    const accounts = await db.collection('accounts');

    const query: any = { mock: { $exists: false } };
    if (openToArray.length) query.openTo = { $in: openToArray };

    const queryResults = await accounts.aggregate([
        {$match: query},
        {$sample: {size: parseInt(count) || 6}}
    ]).toArray();

    res.json(queryResults);
}
