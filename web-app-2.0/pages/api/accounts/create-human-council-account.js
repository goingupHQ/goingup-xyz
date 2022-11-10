import { getDb } from  '../_get-db-client';
import { encrypt } from '../_encryption';
import { ethers } from  'ethers';

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { code, account, email1, email2, email3, email4, inviteMessage } = req.body;

    if (!account.name) {
        res.status(400).json({ error: 'Account name is required' });
        return;
    }

    if (!account.email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    if (!code) {
        res.status(400).json({ error: 'Login code is required' });
        return;
    }

    const db = await getDb();

    // get record from human-council-codes collection
    const humanCouncilCode = await db.collection('human-council-codes').findOne({ code });

    if (!humanCouncilCode) {
        res.status(400).json({ error: 'Code not found' });
        return;
    }

    if (humanCouncilCode.email !== account.email) {
        res.status(400).json({ error: 'Email does not match code' });
        return;
    }

    // create random wallet
    const wallet = ethers.Wallet.createRandom();

    // encrypt private key
    const encryptedPrivateKey = encrypt(wallet.privateKey, process.env.CUSTODY_KEY);

    account.reputationScore = 60;
    account.address = wallet.address;
    account.walletKey = encryptedPrivateKey;

    // upsert account to human-council-accounts collection
    const accounts = db.collection('accounts');

    // check if account with this email already exists
    const existingAccount = await accounts.findOne({ email: account.email });

    if (existingAccount) {
        res.status(400).json({ error: 'Account with this email already exists' });
        return;
    }

    // insert account
    await accounts.updateOne({ email: account.email }, { $set: account }, { upsert: true });

    // delete code from human-council-codes collection
    await db.collection('human-council-codes').deleteOne({ code });

    // send invite emails
    if (email1 || email2 || email3 || email4) {
        try {
            const inviteProps = {
                username: account.name,
                subject: 'Join us at GoingUP',
                confirmationUrl: `https://app.goingup.xyz/create-account`,
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

    res.status(200).json({ message: 'Account created' });
}