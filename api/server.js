import {} from 'dotenv/config';
import express from 'express';
import { ethers } from 'ethers';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/get-signer-address', (req, res) => {
    const { message, signature } = req.query;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    res.send({ recoveredAddress });
});

app.listen(process.env.PORT, () => {
    console.log(`GoingUP API listening on port ${process.env.PORT}`);
});
