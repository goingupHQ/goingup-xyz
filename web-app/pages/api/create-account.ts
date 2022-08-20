import { ethers } from 'ethers';
import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import { renderInviteFriendEmail } from '@/templates/email/render-mail';
import { sendEmail } from './services/_sendinblue';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, 'create-account', body.signature);

    if (isSignatureValid) {
        const db = await getDb();
        const accounts = db.collection('accounts');

        const { account, email1, email2, email3, email4, inviteMessage } = body;
        account.address = body.address;
        account.reputationScore = 50; // completed onboarding score
        account.chain = ethers.utils.isAddress(body.address) ? 'Ethereum' : 'Cardano';
        const result = await accounts.insertOne(account);

        if (email1 || email2 || email3 || email4) {
            try {
                const inviteProps = {
                    username: account.name,
                    subject: 'Join us at GoingUP',
                    confirmationUrl: `https://app.goingup.xyz/create-account?referrer=${account.address}`,
                    personalMessage: inviteMessage
                }

                if (inviteMessage) inviteProps.personalMessage = inviteMessage;
                const inviteHtml = renderInviteFriendEmail(inviteProps);

                if (email1) sendEmail(null, email1, 'Join us at GoingUP', '', inviteHtml);
                if (email2) sendEmail(null, email2, 'Join us at GoingUP', '', inviteHtml);
                if (email3) sendEmail(null, email3, 'Join us at GoingUP', '', inviteHtml);
                if (email4) sendEmail(null, email4, 'Join us at GoingUP', '', inviteHtml);
            } catch (err) {
                console.log(err);
            }
        }

        if (req.query.referrer) {
            try {
                await accounts.updateOne({ address: req.query.referrer }, {
                    $inc: { reputationScore: 10 }
                });
            } catch (err) {
                console.log(err);
            }
        }

        res.status(200).send('account-created');
    } else {
        res.status(401).send('invalid-signature');
    }
}
