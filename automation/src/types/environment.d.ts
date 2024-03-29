declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VAPID_PUBLIC_KEY: string;
      VAPID_PRIVATE_KEY: string;
      ALCHEMY_POLYGON_KEY: string;
      ALCHEMY_MUMBAI_KEY: string;
      ETHERSCAN_KEY: string;
      MONGODB_URI: string;
      PAPERTRAIL_API_TOKEN: string;
      PROJECT_PATH: string;
      SIB_KEY: string;
      DEPLOYMENT: 'dev' | 'production';
      BACKEND_WALLET_ADDRESS: string;
      BACKEND_WALLET_PK: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      MINT_EMAIL_HOST: string;
      MINT_EMAIL_PORT: string;
      MINT_EMAIL_SPRT: string;
      MINT_EMAIL_ADDR: string;
      MINT_EMAIL_PASS: string;
      GC_KMS_LOCATION: string;
      GC_KMS_KEYRING: string;
      GC_KMS_KEY_ID: string;
      GCS_PRIVATE_KEY: string;
      GCS_CLIENT_EMAIL: string;
      GCS_PROJECT_ID: string;
    }
  }
}
export {};
