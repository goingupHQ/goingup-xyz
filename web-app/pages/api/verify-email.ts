import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';

export default async function handler(req, res) {
    const { address, signature, code } = req.query;
    const isSignatureValid = validateSignature(address, 'verify-email', signature);

    if (isSignatureValid) {
        const db = await getDb();
        const col = await db.collection('email-verification');
        const rec = await col.findOne({ code });

        if (rec) {
            await db.collection('accounts')
                .updateOne({ address },
                    {
                        $set: {
                            email: rec.email
                        },
                        $inc: {
                            reputationScore: 10
                        }
                    });
            res.status(200).send('email-verified');
        } else {
            res.status(400).send('no-record-found');
        }
    } else {
        res.status(401).send('invalid-signature');
    }
}
