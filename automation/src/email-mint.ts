import { getDb } from './get-db-client';
import { EmailMintRequest } from './types/email-mint';

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

  console.log(requests);
};

processConfirmedEmailMints();