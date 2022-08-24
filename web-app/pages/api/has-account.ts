import {ethers} from 'ethers';
import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    let address = req.query.address;

    if (ethers.utils.isAddress(address)) address = ethers.utils.getAddress(address);

    const db = await getDb();
    const accounts = db.collection('accounts');
    const account = await accounts.findOne({ address });

    if (account) {
        res.send({ hasAccount: true });
    } else {
        res.send({ hasAccount: false });
    }
}
