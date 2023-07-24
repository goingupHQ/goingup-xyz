import * as dotenv from 'dotenv';
dotenv.config();
import Imap from 'imap';
import { simpleParser } from 'mailparser';

const imapConfig: Imap.Config = {
  user: process.env.MINT_EMAIL_ADDR!,
  password: process.env.MINT_EMAIL_PASS!,
  port: Number(process.env.MINT_EMAIL_PORT!),
  host: process.env.MINT_EMAIL_HOST!,
  tls: true,
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig);
    imap.once('ready', () => {
      imap.openBox('INBOX', false, () => {
        imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
          const f = imap.fetch(results, { bodies: '' });
          f.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                console.log(parsed);
                // do your shit
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

getEmails();