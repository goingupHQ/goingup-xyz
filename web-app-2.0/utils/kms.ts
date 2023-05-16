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

const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);

export const encrypt = async (text: string) => {
  const plaintext = Buffer.from(text);
  const plaintextCrc32c = crc32.calculate(plaintext);

  const [result] = await client.encrypt({
    name: keyName,
    plaintext,
  });

  const ciphertextBuffer = result?.ciphertext as Buffer;
  const ciphertext = ciphertextBuffer.toString('base64');
  return ciphertext;
}

export const decrypt = async (ciphertext: string) => {
  const ciphertextBuffer = Buffer.from(ciphertext);

  const [result] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertext
  });

  const plaintext = result?.plaintext as Buffer;
  return plaintext.toString();
}