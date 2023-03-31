export {};

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
    }
  }
}
