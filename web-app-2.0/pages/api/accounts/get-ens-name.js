// this api endpoint searches for ENS names that match the address of the user's wallet

import { ethers } from 'ethers';

export default async function handler(req, res) {
    const { address } = req.query;

    if (!address) {
        res.status(400).json({ error: 'Address is required' });
        return;
    }

    if (!ethers.utils.isAddress(address)) {
        res.status(400).json({ error: 'Invalid address' });
        return;
    }

    const ethMainnetProvider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_ETHEREUM_MAINNET);
    const name = await ethMainnetProvider.lookupAddress(address);

    res.status(200).send(name);
};
