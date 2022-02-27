import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';

export default async function handler(req, res) {
    const { address, follows, signature } = req.query;
    const isSignatureValid = validateSignature(address, 'follow', signature);

    if (isSignatureValid) {
        const db = await getDb();
        const col = await db.collection('follows');
        const rec = await col.findOne({ address, follows });

        if (!rec) {
            await col.insertOne({ address, follows });
        }

        res.status(200).send('followed');
    } else {
        res.status(401).send('invalid-signature');
    }
}
