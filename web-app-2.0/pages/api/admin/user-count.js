import { getDb } from '../_get-db-client';

export default async (req, res) => {
    // get user count where 'mock' does not exist
    const db = await getDb();
    const userCount = await db.collection('accounts').countDocuments({ mock: { $exists: false } });

    res.status(200).json({ userCount });
};