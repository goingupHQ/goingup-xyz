import { getDb } from './_get-db-client';

export default async function handler(req, res) {

    const db = await getDb();
    const accounts = await db.collection('accounts');

    const query = { mock: { $exists: false } };

    const queryResults = await accounts.aggregate([
        {$match: query},
    ]).toArray();

    res.json(queryResults);
}