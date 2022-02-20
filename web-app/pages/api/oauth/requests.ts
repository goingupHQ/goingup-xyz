import { dbClient } from '../_get-db-client';

export default async function handler(req, res) {
    await dbClient.connect();
    const { address, uuid, type } = req.query;

    const db = await dbClient.db();
    const oauthRequests = db.collection('oauth-requests');
    await oauthRequests.insertOne({
        uuid, address, type
    });

    res.send({ saved: true });
}
