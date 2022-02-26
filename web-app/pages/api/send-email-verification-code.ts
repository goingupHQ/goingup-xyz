import { dbClient } from './_get-db-client';

export default async function handler(req, res) {
    const { address, email, signature } = req.query;

    res.send({ address, email, signature });
}
