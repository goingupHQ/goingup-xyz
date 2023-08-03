import * as dotenv from 'dotenv';
dotenv.config();
import Imap from 'imap';
import { AddressObject, EmailAddress, simpleParser } from 'mailparser';
import { AllowedEmailMinter, EmailMintRequest } from './types/email-mint';
import { getDb } from './get-db-client';
import { createEmailMintConfirmation } from './email-builder';
import { sendEmail, sendEmailViaMinter } from './send-email';

const mintEmailAddress = process.env.MINT_EMAIL_ADDR!;

const imapConfig: Imap.Config = {
  user: mintEmailAddress!,
  password: process.env.MINT_EMAIL_PASS!,
  port: Number(process.env.MINT_EMAIL_PORT!),
  host: process.env.MINT_EMAIL_HOST!,
  tls: true,
};

const getAndProcessNewEmails = () => {
  try {
    const imap = new Imap(imapConfig);
    imap.once('ready', () => {
      imap.openBox('INBOX', false, () => {
        imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
          const f = imap.fetch(results, { bodies: '' });
          f.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                const sender = parsed.from?.value[0].address;
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

                const recipients: EmailAddress[] = [];

                if (parsed.to !== undefined) {
                  if (Array.isArray(parsed.to)) {
                    for (const toRecipients of parsed.to as AddressObject[]) {
                      for (const recipient of toRecipients.value) {
                        recipients.push(recipient);
                      }
                    }
                  } else {
                    for (const recipient of parsed.to.value) {
                      recipients.push(recipient);
                    }
                  }
                }

                if (parsed.cc !== undefined) {
                  if (Array.isArray(parsed.cc)) {
                    for (const ccRecipients of parsed.cc as AddressObject[]) {
                      for (const recipient of ccRecipients.value) {
                        recipients.push(recipient);
                      }
                    }
                  } else {
                    for (const recipient of parsed.cc.value) {
                      recipients.push(recipient);
                    }
                  }
                }

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
                      address: parsed.from?.value[0].address!,
                      name: parsed.from?.value[0].name!,
                    },
                    mintTo: {
                      address: recipient.address!,
                      name: recipient.name!,
                    },
                    tokenId: 1,
                    qty: 1,
                    subject: parsed.subject || '',
                    content: {
                      text: parsed.text || '',
                      html: parsed.html || '',
                    },
                    confirmationId,
                  };
                  emailMintRequests.push(emailMintRequest);
                }

                const emailMintRequestsCollection = db.collection<EmailMintRequest>('email-mint-requests');
                await emailMintRequestsCollection.insertMany(emailMintRequests);

                console.log(`Inserted ${emailMintRequests.length} email mint requests into the database`);

                const emailHtml = createEmailMintConfirmation(
                  `https://app.goingup.xyz/email-mint/confirm/${confirmationId}`
                );

                await sendEmailViaMinter(
                  mintEmailAddress,
                  emailMintRequests[0].mintFrom.address,
                  'Email Mint Confirmation',
                  '',
                  emailHtml
                );
              });
            });
            msg.once('attributes', (attrs) => {
              const { uid } = attrs;
              imap.addFlags(uid, ['\\Seen'], () => {
                console.log('Marked as read!');
              });
            });
          });
          f.once('error', (ex) => {
            return Promise.reject(ex);
          });
          f.once('end', () => {
            console.log('Done fetching all messages!');
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err: unknown) => {
      console.log(err as any);
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  } catch (ex) {
    console.log('an error occurred');
  }
};

getAndProcessNewEmails();
