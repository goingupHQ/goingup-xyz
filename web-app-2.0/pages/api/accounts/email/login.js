import { getDb } from '../../_get-db-client';
import crypto from 'crypto';

export default async function handler(req, res) {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ message: 'Please paste the login code' });
        return;
    }

    const accessToken = crypto.randomBytes(64).toString('hex');

    // expires 100 days from now
    const expires = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);

    // set access token as secure cookie
    res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`,
    ]);

    res.status(200).json({ authenticated: true });
};