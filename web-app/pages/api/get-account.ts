import { ethers } from 'ethers';
import { dbClient } from './_get-db-client';

export default async function handler(req, res) {
    const { address } = req.query;
    await dbClient.connect();
    const db = dbClient.db('main');
    const accounts = db.collection('accounts');

    const account = await accounts.findOne({ address });
    res.status(200).json(account);
}
