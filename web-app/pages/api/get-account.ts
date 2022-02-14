import { ethers } from 'ethers';
import { dbClient } from './_get-db-client';

export default async function handler(req, res) {
    const { address } = req.query;
    await dbClient.connect();
    const db = dbClient.db('main');
    const accounts = db.collection('accounts');

    const account = await accounts.findOne({ address });

    if (!account) {
        res.status(404).send('not-found');
        return;
    } else {
        res.status(200).json(account);
    }
}
