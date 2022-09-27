import { getDb } from '../_get-db-client';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const db = await getDb();
    const { subscription, address } = req.body;
    const endpoint = subscription.endpoint;

    if (!endpoint || !address) {
        res.status(400).json({ error: 'Invalid subscription' });
        return;
    }

    const subscriptionUpdate = { ...subscription, address };
    delete subscriptionUpdate.endpoint;
    await db.collection('psn-subscriptions').updateOne(
        { endpoint },
        {
            $set: {
                ...subscriptionUpdate,
            },
        },
        { upsert: true }
    );

    res.status(200).send('OK');
}
