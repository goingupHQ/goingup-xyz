import { ethers } from 'ethers';
import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature.js';
import * as InviteFriend from '../../templates/email/invite-friend.js';
import { render } from 'mjml-react';
import { sendEmail } from './services/_sendinblue';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, 'create-account', body.signature, req, res);

    if (isSignatureValid) {
        const db = await getDb();
        const accounts = db.collection('accounts');

        const { account, email1, email2, email3, email4, inviteMessage } = body;
        account.address = body.address;
        account.reputationScore = 50; // completed onboarding score
        account.chain = ethers.utils.isAddress(body.address) ? 'Ethereum' : 'Near';
        const result = await accounts.insertOne(account);

        if (email1 || email2 || email3 || email4) {
            try {
                const inviteProps = {
                    username: account.name,
                    subject: 'Join us at GoingUP',
                    confirmationUrl: `https://app.goingup.xyz/create-account?referrer=${account.address}`,
                    personalMessage: inviteMessage,
                };

                if (inviteMessage) inviteProps.personalMessage = inviteMessage;
                const { html: inviteHtml} = render(InviteFriend.generate(inviteProps), { validationLevel: 'strict' });

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
                await accounts.updateOne(
                    { address: req.query.referrer },
                    {
                        $inc: { reputationScore: 10 },
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }

        // gitcoin appreciation token claim
        // check if address is in donors collection and has not claimed yet
        const donors = db.collection('donors');
        const donor = await donors.findOne({ address: body.address, claimed: { $exists: false } });

        if (donor) {
            // mint gitcoin appreciation token
            const contractAddress = '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2';
            const abi = ['function manualMint(address account, uint256 tokenId, uint256 qty) public'];

            // create polygon alchemy mainnet provider
            const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);

            // create backend wallet
            const wallet = new ethers.Wallet(process.env.GOINGUP_BACKEND_PK);
            const signer = wallet.connect(provider);

            // create contract instance
            const contract = new ethers.Contract(contractAddress, abi, signer);

            // get gas price
            const gasResponse = await fetch('https://gasstation-mainnet.matic.network/v2');
            const gasData = await gasResponse.json();

            const { maxFee, maxPriorityFee } = gasData.fast;

            // mint token
            const tx = await contract.manualMint(body.address, 6, 1, {
                maxFeePerGas: ethers.utils.parseUnits(maxFee.toFixed(0).toString(), 'gwei'),
                maxPriorityFeePerGas: ethers.utils.parseUnits(maxPriorityFee.toFixed(0).toString(), 'gwei'),
            });
            console.log('tx', tx);

            // update donor record
            await donors.updateOne(
                {
                    address: body.address,
                },
                {
                    $set: {
                        claimed: true,
                    },
                }
            );
        }

        res.status(200).send('account-created');
    } else {
        res.status(401).send('invalid-signature');
    }
}
