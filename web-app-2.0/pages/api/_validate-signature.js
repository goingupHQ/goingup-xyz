import { ethers } from 'ethers';
import { getCookie } from 'cookies-next';
import { getDb } from './_get-db-client';

export const validateSignature = async (address, message, signature, req, res) => {
    let isSignatureValid = false;
    try {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        isSignatureValid = recoveredAddress === address;
    } catch (error) {
        console.error(`validateSignature error: ${error}`);
    }

    let isSignedIn = false;
    try {
        const authToken = getCookie('access_token', { req, res });

        if (authToken) {
            const db = await getDb();
            const token = await db.collection('access-tokens').findOne({ token: authToken });
            if (token) {
                isSignedIn = token.address === address;
            }
        }
    } catch (error) {
        console.error(`validateSignature signin error: ${error}`);
    }
    console.log(`validateSignature: ${isSignatureValid} || ${isSignedIn}`);
    return isSignatureValid || isSignedIn;
};
