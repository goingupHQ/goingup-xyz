import { ethers } from "ethers";
const Web3Token = require('web3-cardano-token/dist/node');


export const validateSignature = async (address: string, message: string, signature: string) => {
    if (ethers.utils.isAddress(address)) {
        // ethereum
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        return address === recoveredAddress;
    } else {
        // cardano for now
        const cardanoVerify = await Web3Token.verify(signature);
        return address === cardanoVerify.address;
    }
}