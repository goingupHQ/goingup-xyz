import { sendEmail } from '../../services/_sendinblue';
import { renderEmailLoginEmail } from '../../../../templates/email/render-mail';

export default async function handler(req, res) {
    const emailProps = {
        subject: 'Login to GoingUP',
    }

    const emailHtml = renderEmailLoginEmail(emailProps);
    sendEmail(null, 'mark.ibanez@gmail.com', 'Login to GoingUP', '', emailHtml);
    res.status(200).send('email-sent');
};