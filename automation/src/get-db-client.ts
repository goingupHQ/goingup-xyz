import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env')});
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = { };

let client;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export const getDb = async () => {
    const client = await clientPromise;
    return client.db('main');
};
