import { ethers } from 'ethers';
import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, 'update-account', body.signature);

    if (isSignatureValid) {
        const db = await getDb();
        const accounts = db.collection('accounts');
        const account = body.account;
        const payload: any = { $set: account }
        if (account.twitter) payload.$inc = { reputationScore: 10 }
        await accounts.updateOne({ address: body.address }, payload);
        res.status(200).send('account-updated');
    } else {
        res.status(401).send('invalid-signature');
    }
}
