import { ethers } from 'ethers';

export default async function handler(req, res) {
    const account = req.query.account?.toLowerCase() || 'main';

    let pk;
    switch (account) {
        case 'emmanuel':
            pk = process.env.EMMANUEL_SALES_PK;
            break;
        case 'anbessa':
            pk = process.env.ANBESSA_SALES_PK;
            break;
        case 'ebae':
            pk = process.env.EBAE_SALES_PK;
            break;
        case 'main':
        default:
            pk = process.env.GOINGUP_SALES_PK;
            break;
    }

    const wallet = new ethers.Wallet(pk);
    const address = wallet.address;

    res.send({ address });
}
