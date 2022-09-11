import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export const getAccount = async (address) => {
    const db = await getDb();
    const accounts = db.collection('accounts');

    const account = await accounts.findOne({ address }, { projection: { _id: 0, name: 1, profilePhoto: 1 } });
    return account;
}

export default async function handler(req, res) {
    const { address } = req.query;
    res.send(await getAccount(address));
}
