import { getDb } from './../../_get-db-client';
import { getProof } from './../../_merkle';
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
    // Run the cors middleware
    // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const { address } = req.query;
    const db = await getDb();
    const whitelist = await (
        await db.collection('membership-nft-whitelist').find().toArray()
    ).map((doc) => doc.walletAddress);

    const proof = getProof(address, whitelist);

    res.send(proof);
}
