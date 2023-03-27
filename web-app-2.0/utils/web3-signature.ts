import { ethers } from 'ethers';

export const validateSignature = async (address: string, message: string, signature: string): Promise<boolean> => {
  let isSignatureValid = false;
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    isSignatureValid = recoveredAddress === address;
  } catch (error) {
    console.error(`validateSignature error: ${error}`);
  }

  return isSignatureValid;
};
