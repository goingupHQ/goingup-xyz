import { getDb } from '../../_get-db-client';
import { sendEmail } from '../../services/_sendinblue';
import * as HumanCouncilLoginCode from '../../../../templates/email/human-council-login-code.js';
import { render } from 'mjml-react';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    // generate a random 12 character mixed case alphanumeric code
    const code = Math.random().toString(36).substring(2, 14).toUpperCase();

    // save the code to the database
    const db = await getDb();
    db.collection('human-council-codes')
        .updateOne({ email }, { $set: { email, code } }, { upsert: true })
        .then(() => {
            // send the email
            const emailProps = { code };

            const { html: emailHtml } = render(HumanCouncilLoginCode.generate(emailProps), { validationLevel: 'strict' });
            sendEmail(null, email, 'Human Council x GoingUP Login Code', '', emailHtml);
            res.status(200).send('email-sent');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        });
}
