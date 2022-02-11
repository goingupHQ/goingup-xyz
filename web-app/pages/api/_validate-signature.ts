import { ethers } from "ethers";

export const validateSignature = (address: string, message: string, signature: string) => {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return address === recoveredAddress;
}