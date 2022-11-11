import { getDb } from '../_get-db-client';
import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { query } = req.query;
    const db = await getDb();

    const results = [];

    const nameRegex = new RegExp(`${query}`, 'i');
    const accounts = await db
        .collection('accounts')
        .find({ name: nameRegex, chain: 'Ethereum', mock: { $exists: false } })
        .limit(12)
        .toArray();

    res.status(200).json(accounts);
}
