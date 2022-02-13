import { ethers } from 'ethers';
import { dbClient } from './_get-db-client';
import { validateSignature } from './_validate-signature';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, 'create-account', body.signature);

    if (isSignatureValid) {
        await dbClient.connect();
        const db = dbClient.db('main');
        const accounts = db.collection('accounts');

        const account = body.account;
        account.address = body.address;

        const result = await accounts.insertOne(account);
        console.log(result);
        res.status(200).send('account-created');
    } else {
        res.status(401).send('invalid-signature');
    }
}
