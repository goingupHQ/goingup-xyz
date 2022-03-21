import InviteFriend from './../../src/templates/email/invite-friend';
import { renderInviteFriendEmail } from './../../src/templates/email/render-mail';

function CreateAccount() {
    const payload = {
        username: 'Marky',
        subject: 'Join us at GoingUP',
        confirmationUrl: 'https://app.goingup.xyz',
        personalMessage: 'hello'
    }

    const html = renderInviteFriendEmail(payload);
    console.log(html);

    return (
        <>
            <InviteFriend {...payload} />
        </>
    );
}

export default CreateAccount;
