import { KeyManagementServiceClient } from '@google-cloud/kms';
import crc32 from 'fast-crc32c';

const projectId = process.env.GCS_PROJECT_ID;
const locationId = process.env.GC_KMS_LOCATION;
const keyRingId = process.env.GC_KMS_KEYRING;
const keyId = process.env.GC_KMS_KEY_ID;

const client = new KeyManagementServiceClient({
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY,
  }
});

export const encrypt = async (text: string) => {
  const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);
  const plaintext = Buffer.from(text);
  const plaintextCrc32c = crc32.calculate(plaintext);

  const [result] = await client.encrypt({
    name: keyName,
    plaintext,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  });

  const cipherText = result.ciphertext;
  if (!result.verifiedPlaintextCrc32c) throw new Error('Encryption failed, request corrupted in-transit');

  const cipherTextCrc32c = crc32.calculate(cipherText as Buffer);
  const responseCrc32c = Number(result.ciphertextCrc32c?.value);
  if (cipherTextCrc32c !== responseCrc32c) throw new Error('Encryption failed, response corrupted in-transit');

  return { result, cipherText: (result.ciphertext as Buffer).toString('base64') };
}

export const decrypt = async (ciphertext: string) => {
  const keyName2 = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);
  const ciphertextBuffer = Buffer.from(ciphertext);

  const [result] = await client.decrypt({
    name: keyName2,
    ciphertext: ciphertext
  });

  const plaintextCrc32c = crc32.calculate(result.plaintext as Buffer);
  const responseCrc32c = Number(result.plaintextCrc32c?.value);
  if (plaintextCrc32c !== responseCrc32c) throw new Error('Decryption failed, response corrupted in-transit');

  return { result, plainText: (result.plaintext as Buffer).toString('utf8') };
}