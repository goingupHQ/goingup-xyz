import { getDb } from '../../_get-db-client';
import crypto from 'crypto';

export default async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ message: 'Please paste the login code' });
        return;
    }

    const key = crypto.randomBytes(64).toString('hex');

    // expires 100 days from now
    const expires = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);

    res.status(200).json({ key, expires });
};