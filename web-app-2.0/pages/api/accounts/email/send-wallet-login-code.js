import { sendEmail } from '../../services/_sendinblue';
// import { renderEmailWalletLoginEmail } from '../../../../templates/email/render-mail';

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

    // send the email

    const emailProps = { code };

    // const emailHtml = renderEmailWalletLoginEmail(emailProps);
    // sendEmail(null, email, 'Login to GoingUP', '', emailHtml);
    res.status(200).send('email-sent');
}
