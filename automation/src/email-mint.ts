import { writeFileSync } from 'fs';
import { webAppBaseUrl } from './constants';
import { createAcceptTokenEmail } from './email-builder';
import { getDb } from './get-db-client';
import { EmailMintRequest } from './types/email-mint';
import { sendEmailViaMinter } from './send-email';

export const processConfirmedEmailMints = async () => {
  const db = await getDb();
  const col = await db.collection<EmailMintRequest>('email-mint-requests');

  const requests = await col
    .find({
      confirmedBySenderOn: { $exists: true },
      emailSentToRecipient: {
        $exists: false,
      },
    })
    .toArray();

  console.log(`Found ${requests.length} confirmed email mint requests`);

  for (const request of requests) {
    const fromName = request.mintFrom.name;
    const fromEmail = request.mintFrom.address;
    const mintMessage = request.finalMintMessage || '(no message)';
    const id = request._id as string;

    const acceptUrl = `${webAppBaseUrl}/email-mint/accept/${id}`;

    const emailHtml = createAcceptTokenEmail(fromName, fromEmail, mintMessage, acceptUrl);
    const mintEmailAddress = process.env.MINT_EMAIL_ADDR!;

    sendEmailViaMinter(
      mintEmailAddress,
      request.mintTo.address,
      `${fromName || 'Someone'} has sent you token(s)!`,
      '',
      emailHtml
    );

    col.updateOne(
      {
        _id: request._id,
      },
      {
        $set: {
          emailSentToRecipient: new Date(),
        },
      }
    );

    console.log(`Sent email to ${request.mintTo.address} for mint request ${request._id}`);
  }

  console.log(`Finished processing ${requests.length} confirmed email mint requests`);
};