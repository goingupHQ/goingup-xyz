import { sendEmail } from '../services/_sendinblue';
import { render } from 'mjml-react';
import * as InviteFriend from '../../../templates/email/invite-friend.js';
import * as HumanCouncilLoginCode from '../../../templates/email/human-council-login-code.js';

export default async function handler(req, res) {
    const emailProps = {
        username: 'test',
        subject: 'test',
        confirmationUrl: 'test',
        personalMessage: 'test',
        code: '123456'
    };

    const emailHtml = render(HumanCouncilLoginCode.generate(emailProps), { validationLevel: 'strict' });
    sendEmail(null, 'mark@goingup.xyz', 'Join us at GoingUP', '', emailHtml.html);

    res.status(200).send({
        html: emailHtml.html,
        result: 'email-sent'
    });
};
