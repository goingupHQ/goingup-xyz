import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI; console.log('MongoDB URI: ', uri);
export const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });