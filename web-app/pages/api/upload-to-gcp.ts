import { Storage } from '@google-cloud/storage';

export default async function handler(req, res) {
    const storage = new Storage({
        projectId: process.env.GCS_PROJECT_ID,
        credentials: {
            client_email: process.env.GCS_CLIENT_EMAIL,
            private_key: process.env.GCS_PRIVATE_KEY
        }
    });

    const bucket = storage.bucket(process.env.GCS_BUCKET);
    const file = bucket.file(req.query.file);
    const options = {
        expires: Date.now() + 1 * 60 * 1000, //  1 minute,
        fields: { 'x-goog-meta-test': 'data' }
    };

    const [response] = await file.generateSignedPostPolicyV4(options);
    res.status(200).json(response);
}
