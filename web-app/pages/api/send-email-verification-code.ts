import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import { sendEmail } from './services/_sendinblue';
import crypto from 'crypto';

export default async function handler(req, res) {
    const { address, name, email, signature } = req.query;

    const isSignatureValid = validateSignature(address, 'send-verification-email-code', signature);

    if (isSignatureValid) {
        const db = await getDb();
        const col = await db.collection('email-verification');
        const record = await col.findOne({ address });

        let code;
        if (record) {
            code = record.code;
        } else {
            code = crypto.randomBytes(10).toString('hex');
            await col.insertOne({ code, address, email });
        }

        sendEmail(name, email, 'GoingUP Email Verification Code', `Your code is ${code}`, `Your code is ${code}`);
        res.send('email-verification-code-sent');
    } else {
        res.status(401).send('invalid-signature');
    }
}
