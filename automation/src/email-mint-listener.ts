import * as dotenv from 'dotenv';
dotenv.config();
import { MailListener } from 'mail-listener-type';
import fs from 'fs';
import { EmailContact, Mail } from './types/mail-listener';
import { getDb } from './get-db-client';
import { AllowedEmailMinter, EmailMintRequest } from './types/email-mint';
import { AddressObject, EmailAddress } from 'mailparser';
import { createEmailMintConfirmation } from './email-builder';
import { sendEmailViaMinter } from './send-email';

export const mailListener = new MailListener({
  username: process.env.MINT_EMAIL_ADDR!,
  password: process.env.MINT_EMAIL_PASS!,
  host: process.env.MINT_EMAIL_HOST!,
  port: parseInt(process.env.MINT_EMAIL_PORT!),
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  debug: console.log,
  autotls: 'never',
  tlsOptions: { rejectUnauthorized: false },
  mailbox: 'INBOX',
  searchFilter: ['UNSEEN'],
  markSeen: true,
  fetchUnreadOnStart: true,
  attachments: false,
});

export const startMailListener = async () => {
  mailListener.start();

  mailListener.on('server:connected', function () {
    console.log(`Minter email listener connected to ${process.env.MINT_EMAIL_HOST}:${process.env.MINT_EMAIL_PORT}`);
  });

  mailListener.on('mailbox', function (mailbox) {
    console.log(`Minter email listener mailbox: ${mailbox.messages.total} total messages`);
  });

  mailListener.on('server:disconnected', function () {
    console.log('Minter email listener disconnected');
  });

  mailListener.on('error', function (err) {
    console.log(err);
  });

  // mailListener.on('headers', function (headers, seqno) {
  //   // do something with mail headers
  // });

  mailListener.on('body', function (body, seqno) {
    // do something with mail body
  });

  // mailListener.on('attachment', function (attachment, path, seqno) {
  //   // do something with attachment
  // });

  mailListener.on('mail', async (mail: Mail, seqno: number) => {
    // fs.writeFileSync('mail.json', JSON.stringify(mail, null, 2));
    const sender = mail.from?.value[0].address;
    if (!sender) {
      console.error('Email does not have sender');
      return;
    }

    // check if sender is on email mint allow list
    const db = await getDb();
    const collection = db.collection<AllowedEmailMinter>('email-mint-allow-list');
    const allowedEmailMinter = await collection.findOne({ email: sender });
    if (!allowedEmailMinter || !allowedEmailMinter.allowed) {
      console.error(`Email sender ${sender} is not on allow list`);
      return;
    } else {
      console.log(`Email sender ${sender} is on allow list`);
    }

    const recipients: EmailContact[] = [];

    if (mail.to !== undefined) {
      if (Array.isArray(mail.to)) {
        for (const toRecipients of mail.to as AddressObject[]) {
          for (const recipient of toRecipients.value) {
            recipients.push({
              address: recipient.address!,
              name: recipient.name || 'Unnamed Recipient',
            });
          }
        }
      } else {
        for (const recipient of mail.to.value) {
          recipients.push(recipient);
        }
      }
    }

    if (mail.cc !== undefined) {
      if (Array.isArray(mail.cc)) {
        for (const ccRecipients of mail.cc as AddressObject[]) {
          for (const recipient of ccRecipients.value) {
            recipients.push({
              address: recipient.address!,
              name: recipient.name || 'Unnamed Recipient',
            });
          }
        }
      } else {
        for (const recipient of mail.cc.value) {
          recipients.push(recipient);
        }
      }
    }

    const mintEmailAddress = process.env.MINT_EMAIL_ADDR!;
    const hasMintEmailAddress = recipients.some((recipient) => recipient.address === mintEmailAddress);

    if (!hasMintEmailAddress) {
      console.error('Email does not have mint email address as recipient');
      return;
    }

    const emailMintRequests: EmailMintRequest[] = [];
    // generate random 8 character base64 string
    // it should be lowercase and alphanumeric
    const confirmationId = Buffer.from(`${Math.random().toString(36).substring(2, 14)}`)
      .toString('base64')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    for (const recipient of recipients) {
      if (recipient.address === mintEmailAddress) continue;

      const emailMintRequest: EmailMintRequest = {
        mintFrom: {
          address: mail.from?.value[0].address!,
          name: mail.from?.value[0].name!,
        },
        mintTo: {
          address: recipient.address!,
          name: recipient.name!,
        },
        tokenId: 1,
        qty: 1,
        subject: mail.subject || '',
        content: {
          text: mail.text || '',
          html: mail.html || '',
        },
        confirmationId,
      };
      emailMintRequests.push(emailMintRequest);
    }

    const emailMintRequestsCollection = db.collection<EmailMintRequest>('email-mint-requests');
    await emailMintRequestsCollection.insertMany(emailMintRequests);

    console.log(`Inserted ${emailMintRequests.length} email mint requests into the database`);

    const emailHtml = createEmailMintConfirmation(`https://app.goingup.xyz/email-mint/confirm/${confirmationId}`);

    await sendEmailViaMinter(
      mintEmailAddress,
      emailMintRequests[0].mintFrom.address,
      'Email Mint Confirmation',
      '',
      emailHtml
    );
  });
};

export const stopMailListener = () => {
  mailListener.stop();
};
