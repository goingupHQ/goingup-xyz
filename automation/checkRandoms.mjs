import crypto from 'crypto';
import { ethers } from 'ethers';
import fs from 'fs';

const provider = ethers.providers.getDefaultProvider('homestead');
while (true) {
    try {
        const random = crypto.randomBytes(32).toString('hex');
        const wallet = new ethers.Wallet(random, provider);
        const address = wallet.address;
        const balance = await wallet.getBalance();
        console.log(`${random} ${address} ${balance}`);
        if (balance.gt(0)) {
            fs.writeFileSync(`./${address}.json`, JSON.stringify({ address, balance, random }));
        }
    } catch (err) {
        console.error('lol something went wrong');
    }
}