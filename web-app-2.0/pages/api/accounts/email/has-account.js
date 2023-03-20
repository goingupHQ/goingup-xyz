import { getDb } from "../../_get-db-client";

export default async function handler (req, res) {
    // get email from query string
    const { email } = req.query;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    const db = await getDb();
    const account = await db.collection('accounts').findOne({ email });

    if (account) {
        res.status(200).json({ hasAccount: true });
        return;
    } else {
        res.status(200).json({ hasAccount: false });
        return;
    }
}