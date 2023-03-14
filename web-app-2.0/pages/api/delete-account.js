import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, body.account, 'delete-account', body.signature, req, res);

    if (isSignatureValid) {
        const db = await getDb();
        const accounts = db.collection('accounts');
        if (body.address) {
            await accounts.updateOne( { address: body.address }, { $set: { isDeleted: true } } );
        }
        
        res.status(200).send('account-deleted');
    } else {
        res.status(401).send('invalid-signature');
    }
}