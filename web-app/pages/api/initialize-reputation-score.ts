import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    console.log(req.query);
    const db = await getDb();
    const accounts = db.collection('accounts');
    await accounts.updateMany({ reputationScore: { $exists: false }}, { $set: { reputationScore: 50 }});
    res.status(200).send('reputation-scores-initialized');
}
