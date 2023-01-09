import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const db = await getDb();
    const accounts = await db.collection('orgs');

    const queryResults = await accounts.aggregate([]).toArray();

    res.json(queryResults);
}
