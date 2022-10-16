import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export const getAccount = async (address) => {
    const db = await getDb();
    const accounts = db.collection('accounts');

    const account = await accounts.findOne({ address });
    return account;
}

export default async function handler(req, res) {
    const { address } = req.query;
    const account = await getAccount(address);

    if (!account) {
        res.status(404).send('not-found');
        return;
    } else {
        res.status(200).json(account);
    }
}
