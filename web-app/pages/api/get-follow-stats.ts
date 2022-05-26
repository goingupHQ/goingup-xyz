import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address } = req.query;

    const db = await getDb();

    const followers = await db.collection('follows').countDocuments({ follows: address });
    const following = await db.collection('follows').countDocuments({ address });

    res.send({ followers, following });
}
