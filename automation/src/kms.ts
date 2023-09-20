import { KeyManagementServiceClient } from '@google-cloud/kms';

const projectId = process.env.GCS_PROJECT_ID!;
const locationId = process.env.GC_KMS_LOCATION!;
const keyRingId = process.env.GC_KMS_KEYRING!;
const keyId = process.env.GC_KMS_KEY_ID!;

const client = new KeyManagementServiceClient({
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY!,
  }
});

export const encrypt = async (text: string) => {
  const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);
  const plaintext = Buffer.from(text);

  const [result] = await client.encrypt({
    name: keyName,
    plaintext,
  });

  const cipherText = result.ciphertext;
  return { result, cipherText: (result.ciphertext as Buffer).toString('base64') };
}

export const decrypt = async (ciphertext: string) => {
  const keyName2 = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);
  const ciphertextBuffer = Buffer.from(ciphertext);

  const [result] = await client.decrypt({
    name: keyName2,
    ciphertext: ciphertext
  });

  const responseCrc32c = Number(result.plaintextCrc32c?.value);
  return { result, plainText: (result.plaintext as Buffer).toString('utf8') };
}