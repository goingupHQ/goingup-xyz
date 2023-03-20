import { getDb } from '../get-db-client.mjs';

console.log('Updating accounts without chain property and set it to "Ethereum"');
const db = await getDb();
const result = await db.collection('accounts').updateMany({ chain: { $exists: false } }, { $set: { chain: 'Ethereum' } });

console.log(`Updated ${result.modifiedCount} accounts`);
process.exit(0);