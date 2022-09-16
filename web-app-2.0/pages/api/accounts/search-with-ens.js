import { getDb } from '../_get-db-client';
import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { query } = req.query;
    const db = await getDb();

    const results = [];

    const ethMainnetProvider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);
    const address = await ethMainnetProvider.resolveName(query);

    if (address) results.push({ address, name: query });

    const nameRegex = new RegExp(`${query}`, 'i');
    const accounts = await db
        .collection('accounts')
        .find({ name: nameRegex, chain: 'Ethereum', mock: { $exists: false } })
        .limit(10)
        .toArray()

    accounts.forEach(account => {
        results.push({ address: account.address, name: account.name, profilePhoto: account.profilePhoto });
    });

    res.status(200).json(results);
}
