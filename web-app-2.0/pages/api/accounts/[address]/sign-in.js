import crypto from 'crypto';
import { getDb } from '../../_get-db-client';
import { validateSignature } from '../../_validate-signature';
import { setCookie } from 'cookies-next';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { address } = req.query;
    const { signature } = req.body;

    if (!signature) {
        res.status(400).json({ error: 'Missing signature' });
        return;
    }

    const message = `I am signing this message to prove that I own the address ${address}. This message will be used to sign in to app.goingup.xyz and receive an authentication token cookie.`;

    const isValid = await validateSignature(address, message, signature, req, res);

    if (!isValid) {
        res.status(400).json({ error: 'Invalid signature' });
        return;
    }

    const token = crypto.randomBytes(256).toString('hex');

    console.log(`Signing in ${address} with token ${token}`);

    // store token in db
    const db = await getDb();
    await db.collection('access-tokens').insertOne({
        token,
        address,
        createdAt: new Date(),
    });

    // set auth token cookie
    setCookie('access_token', token, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000), // 1 year
        // httpOnly: process.env.VERCEL_ENV === 'preview' ||  process.env.VERCEL_ENV === 'production',
        secure: process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({ token });
};
