import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address, target } = req.query;

    const db = await getDb();

    const follows = await db.collection('follows');
    const follow = await follows.findOne({ address, follows: target });
    const following = follow ? true : false;

    res.send({ following });
}
