import { sendEmail } from '../services/_sendinblue';
import { render } from 'mjml-react';
import * as InviteFriend from '../../../templates/email/invite-friend.js'

export default async (req, res) => {
    const emailProps = {
        username: 'test',
        subject: 'test',
        confirmationUrl: 'test',
        personalMessage: 'test',
    };

    const emailHtml = render(InviteFriend.generate(emailProps), { validationLevel: 'strict' });
    sendEmail(null, 'mark.ibanez@gmail.com', 'Join us at GoingUP', '', emailHtml.html);

    res.status(200).send({
        html: emailHtml.html,
        result: 'email-sent'
    });
};
