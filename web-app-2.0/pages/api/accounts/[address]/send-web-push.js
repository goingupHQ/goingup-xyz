import { getDb } from '../../_get-db-client';
import webpush from '../../_get-web-push';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { address } = req.query;
    const { notification } = req.body;

    const db = await getDb();
    const psnSubscriptions = await db.collection('psn-subscriptions').find({ address }).toArray();

    console.log(`sending web push notifications to ${psnSubscriptions.length} subscriptions...`);
    for (const subscription of psnSubscriptions) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify(notification));
        } catch (e) {
            console.error(e);
        }
    }

    res.status(200).send('OK');
}
