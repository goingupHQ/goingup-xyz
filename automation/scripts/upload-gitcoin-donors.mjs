import csv from 'csvtojson';
import { ethers } from 'ethers';
import { getDb } from '../get-db-client.mjs';

// get donor wallet addresses from csv file
const csvFilePath = './scripts/additional-gitcoin.csv';
const csvData = await csv().fromFile(csvFilePath);

// fix addresses to be checksummed
const addresses = csvData.map((row) => {
    return ethers.utils.getAddress(row.donor_address);
});

// insert addresses into database if they don't already exist
const db = await getDb();
for (const address of addresses) {
    await db.collection('donors').updateOne({ address }, { $set: { address } }, { upsert: true });
    console.log(`Inserted ${address} into database`);
}
