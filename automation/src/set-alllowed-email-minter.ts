import { getDb } from './get-db-client';
import { AllowedEmailMinter } from './types/email-mint';

const main = async () => {
  const db = await getDb();
  const collection = db.collection<AllowedEmailMinter>('email-mint-allow-list');

  const email = process.argv[2];
  const allowed = process.argv[3] === 'true';

  if (!email) {
    throw new Error('Email is required');
  }

  // check valid email via regex
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Email is invalid');
  }

  await collection.updateOne(
    { email },
    {
      $set: {
        email,
        allowed,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(`Email ${email} is now ${allowed ? 'allowed' : 'disallowed'}`);
  process.exit(0);
};

main();
