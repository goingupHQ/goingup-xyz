import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
// @ts-ignore
export const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });
export let connected = false;

export const getDb = async () => {
    if (!connected) {
        await dbClient.connect();
        connected = true;
    }
    return await dbClient.db('main');
}