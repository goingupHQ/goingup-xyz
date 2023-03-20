import { validateSignature } from './../../_validate-signature';
import { getDb } from './../../_get-db-client';
import isAdmin from '../_isAdmin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    const { adminAddress, signature, walletAddress } = req.body;

    const isAdmin = await isAdmin(adminAddress);
    if (!isAdmin) {
        res.status(403).send({ message: 'Not an admin' });
        return;
    }

    const signatureValid = await validateSignature(adminAddress, `Adding ${walletAddress} to whitelist`, signature, req, res);

    if (!signatureValid) {
        res.status(401).send({ message: 'Invalid signature' });
        return;
    }

    const db = await getDb();
    await db.collection('membership-nft-whitelist').updateOne(
        {
            walletAddress,
        },
        { $set: { walletAddress } },
        { upsert: true }
    );

    res.send('wallet added to whitelist');
}
