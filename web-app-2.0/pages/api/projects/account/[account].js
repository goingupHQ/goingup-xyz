import { getDb } from '../../_get-db-client';

export default async function handler(req, res) {
    const { account } = req.query;
    const db = await getDb();

    const projects = await db.collection('goingup-projects').find({ owner: account }).toArray();
    res.send(projects);
}
