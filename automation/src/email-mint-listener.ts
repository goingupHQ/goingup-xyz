import * as dotenv from 'dotenv';
dotenv.config();
import { MailListener } from 'mail-listener-type';
import fs from 'fs';
import { EmailContact, Mail } from './types/mail-listener';
import { getDb } from './get-db-client';
import { AllowedEmailMinter, EmailMintRequest } from './types/email-mint';
import { AddressObject, EmailAddress } from 'mailparser';
import { createEmailMintConfirmation, createEmailMintErrorEmail } from './email-builder';
import { sendEmailViaMinter } from './send-email';
import { Account } from './types/account';
import { ethers } from 'ethers';
import { create } from 'domain';
import { encrypt } from './kms';
import { createCustodialAccount } from './database/account';

export const mailListener = new MailListener({
  username: process.env.MINT_EMAIL_ADDR!,
  password: process.env.MINT_EMAIL_PASS!,
  host: process.env.MINT_EMAIL_HOST!,
  port: parseInt(process.env.MINT_EMAIL_PORT!),
  tls: true,
  connTimeout: 100000,
  authTimeout: 50000,
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
    const sender = mail.from?.value[0].address;
    if (!sender) {
      console.error('Email does not have sender');
      return;
    }

    const mintEmailAddress = process.env.MINT_EMAIL_ADDR!;

    // check if sender is on email mint allow list
    const db = await getDb();

    // check if sender is a custodial wallet
    const accounts = await db.collection<Account>('accounts');
    let senderAccount = await accounts.findOne({ email: sender });
    if (!senderAccount) {
      const wallet = ethers.Wallet.createRandom();
      const encryptedPrivateKey = await encrypt(wallet.privateKey);

      await createCustodialAccount(sender, wallet.address, encryptedPrivateKey.cipherText);
    }

    senderAccount = await accounts.findOne({ email: sender });
    if (!senderAccount) {
      console.error(
        `Email sender ${sender} does not have an account and creating a custodial wallet might have failed`
      );
      return;
    }

    if (!senderAccount.isCustodial || !senderAccount.encryptedPrivateKey || !senderAccount.address) {
      console.error(`Email sender ${sender} does not have a custodial wallet`);

      // send email error
      const errorEmailHtml = createEmailMintErrorEmail(
        'No Custodial GoingUP Wallet',
        `Your email address ${sender} does not have a custodial GoingUP wallet. Please contact <a href="mailto:app@goingup.xyz">GoingUP</a> for assistance.`
      );
      await sendEmailViaMinter(mintEmailAddress, sender, 'Email Mint Error', '', errorEmailHtml);
      return;
    }

    // check if account wallet address has at least 2 MATIC
    const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);
    const senderWalletBalance = await provider.getBalance(senderAccount.address);
    const senderWalletHasEnoughMatic = senderWalletBalance.gte(ethers.utils.parseEther('2'));

    if (!senderWalletHasEnoughMatic) {
      console.error(
        `Email sender ${sender} with address ${senderAccount.address} only has ${senderWalletBalance} MATIC which is not enough to mint`
      );

      // send email error
      const errorEmailHtml = createEmailMintErrorEmail(
        'Not Enough MATIC',
        `Your email address ${sender} with address ${senderAccount.address} only has ${senderWalletBalance} MATIC which is not enough to mint. You need at least 2 MATIC to mint.`
      );
      await sendEmailViaMinter(mintEmailAddress, sender, 'Email Mint Error', '', errorEmailHtml);
      return;
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
