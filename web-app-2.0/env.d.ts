namespace NodeJS {
  interface ProcessEnv {
    VERCEL_ENV: 'production' | 'preview' | 'development';
    EBAE_SALES_PK: string;
    ANBESSA_SALES_PK: string;
    EMMANUEL_SALES_PK: string;
    GOINGUP_SALES_PK: string;
    GOINGUP_BACKEND_PK: string;
    ETHERSCAN_API_KEY: string;
    NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN: string;
    GCS_PRIVATE_KEY: string;
    GCS_CLIENT_EMAIL: string;
    GCS_PROJECT_ID: string;
    GCS_BUCKET: string;
    GC_KMS_LOCATION: string;
    GC_KMS_KEYRING: string;
    GC_KMS_KEY_ID: string;
    ALCHEMY_ETHEREUM_MAINNET: string;
    ALCHEMY_POLYGON_MAINNET: string;
    DISCORD_CLIENT_SECRET: string;
    LINKEDIN_CLIENT_SECRET: string;
    GITHUB_CLIENT_SECRET: string;
    TWITTER_TOKEN: string;
    SIB_KEY: string;
    MONGODB_URI: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_DISCORD_CLIENT_ID: string;
    NEXT_PUBLIC_LINKEDIN_CLIENT_ID: string;
    NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
    DEPLOYMENT: string;
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    VERCEL_ENV: string;
    NEXT_PUBLIC_INFURA_KEY: string;
    MINTER_PK: string;
    GEVENT_TOKENS_ADDR: string;
    NEXT_PUBLIC_NFT_STORAGE_KEY: string;
  }
}
