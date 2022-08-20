import { ethers } from 'ethers';
import { getDb } from '../../_get-db-client';

export default async function handler(req, res) {
    const account = req.query.account?.toLowerCase();

    if (!account) {
        res.status(400).send('Missing account');
        return;
    }

    const txHash = req.query.txhash;

    if (!txHash) {
        res.status(400).send('Missing txhash');
        return;
    }

    // check database if txhash is already claimed
    const db = await getDb();
    const txRecord = await db.collection('membership-payment-txs').findOne({ txHash });
    if (txRecord) {
        res.status(400).send('Txhash already claimed');
        return;
    }

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

    const provider = new ethers.providers.EtherscanProvider(5, 'F24JF73TCUDF38D7PGGYZ7KRFM2XD5S53A');
    const wallet = new ethers.Wallet(pk);
    const signer = new ethers.Wallet(pk, provider);
    const accountAddress = wallet.address;

    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt.status === 0) {
        res.status(500).send('Transaction failed');
        return;
    }

    if (receipt.to !== accountAddress) {
        res.status(500).send('Transaction not sent to correct address');
        return;
    }

    const tx = await provider.getTransaction(txHash);

    if (tx.value.lt(ethers.utils.parseEther('2.2'))) {
        res.status(500).send('Transaction value is too low');
        return;
    }

    const abi = [
        'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
        'function transferFrom(address from, address to, uint256 tokenId)',
    ];

    const contract = new ethers.Contract('0x492a13A2624140c75025be03CD1e46ecF15450F5', abi, signer);

    try {
        const tokenId = await contract.tokenOfOwnerByIndex(accountAddress, 0);
        if (!tokenId) {
            res.status(500).send('No token found');
            return;
        }

        const feeData = await provider.getFeeData();
        feeData.maxFeePerGas = feeData.maxFeePerGas.mul(2);
        feeData.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.mul(2);
        feeData.gasPrice = feeData.gasPrice.mul(2);

        const tx = await contract.transferFrom(accountAddress, receipt.from, tokenId, {
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        });

        res.status(200).send(tx);

        // save txhash to database as claimed
        await db.collection('membership-payment-txs').insertOne({
            txHash,
            account,
            tx,
            claimedOn: new Date()
        });


    } catch (error) {
        res.status(500).send(error);
        return;
    }
}
