import { getDb } from './_get-db-client';

export default async (req, res) => {
    const db = await getDb();
    const orgsCount = await db.collection('orgs').countDocuments();

    res.status(200).json({ orgsCount });
};