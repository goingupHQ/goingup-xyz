import { ethers } from "ethers";
import { getDb } from "../get-db-client";
import { decrypt } from "../kms";
import { Account } from "../types/account";

const main = async () => {
  const db = await getDb();
  const accounts = await db.collection<Account>('accounts');
  const account = await accounts.findOne({ email: 'mark.ibanez@gmail.com' });
  const encryptedPrivateKey = account?.encryptedPrivateKey;
  const decryptResult = await decrypt(encryptedPrivateKey!);
  const privateKey = decryptResult.plainText;
  const address = account?.address;
  console.log(`address: ${address}`);
  console.log(`privateKey: ${privateKey}`);
  console.log(`encryptedPrivateKey: ${encryptedPrivateKey}`);

  const derivedWallet = new ethers.Wallet(privateKey);
  const derivedAddress = derivedWallet.address;
  console.log(`derivedAddress: ${derivedAddress}`);
};

main();