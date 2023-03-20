import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address, count, includeNoPhotos } = req.query;

    const parsedCount = parseInt(count || 12);

    if (isNaN(parsedCount)) {
        res.status(400).json({ error: 'Invalid count' });
        return;
    }

    if (parsedCount > 100) {
        res.status(400).json({ error: 'Count must be less than 100' });
        return;
    }

    const db = await getDb();
    const accounts = await db.collection('accounts');

    const query = { mock: { $exists: false }, isDeleted: null };

    if (address) {
        const account = await accounts.findOne({ address });
        const { idealCollab } = account;

        query.idealCollab = { $in: idealCollab };
    }

    if (!includeNoPhotos) {
        query.profilePhoto = { $exists: true };
    }

    const queryResults = await accounts.aggregate([
        {$match: query},
        {$sample: {size: parsedCount}}
    ]).toArray();

    res.json(queryResults);
}
