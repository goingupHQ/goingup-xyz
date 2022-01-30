import {} from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();

if (process.env.ENVIRONMENT === 'production') {
    const ALLOWED_ORIGINS = ['goingup-xyz.vercel.app']
    app.use((req, res, next) => {
        let origin = req.headers.origin;
        let allowed = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];
        res.header("Access-Control-Allow-Origin", allowed);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next();
    })
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
    console.log(`GoingUP API listening on port ${process.env.PORT} on ${process.env.ENVIRONMENT}`);
});
