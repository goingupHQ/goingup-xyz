import { getDb } from '../_get-db-client';
import { validateSignature } from '../_validate-signature';

export default async function handler(req, res) {
    const { address, uuid, type, message, signature } = req.query;

    const isSignatureValid = validateSignature(address, `connect-${type}`, signature);

    if (isSignatureValid) {
        const db = await getDb();
        const oauthRequests = db.collection('oauth-requests');
        await oauthRequests.insertOne({
            uuid, address, type
        });

        res.send({ saved: true });
    } else {
        res.status(401).send('invalid-signature');
    }
}
