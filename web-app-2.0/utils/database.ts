import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = { serverApi: ServerApiVersion.v1 };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.DEPLOYMENT === 'dev') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export const getDb = async () => {
    const client = await clientPromise;
    return client.db('main');
};
