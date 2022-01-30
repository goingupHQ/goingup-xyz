import {} from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();

if (process.env.ENVIRONMENT === 'production') {
    app.use(cors({
        origin: ['https://goingup-xyz.vercel.app/']
    }));
}

if (process.env.ENVIRONMENT === 'dev') {
    app.use(cors({
        origin: '*'
    }));
}

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
