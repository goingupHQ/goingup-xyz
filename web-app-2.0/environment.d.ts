declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_ETHEREUM_MAINNET: string;
      ALCHEMY_KEY: string;
      ALCHEMY_POLYGON_MAINNET: string;
      ALCHEMY_POLYGON_TESTNET: string;
      ANBESSA_SALES_PK: string;
      CUSTODY_KEY: string;
      DEPLOYMENT: string;
      DISCORD_CLIENT_SECRET: string;
      EBAE_SALES_PK: string;
      EMMANUEL_SALES_PK: string;
      GCS_BUCKET: string;
      GCS_CLIENT_EMAIL: string;
      GCS_PRIVATE_KEY: string;
      GCS_PROJECT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      GOINGUP_BACKEND_PK: string;
      GOINGUP_SALES_PK: string;
      LINKEDIN_CLIENT_SECRET: string;
      MONGODB_URI: string;
      NEXT_PUBLIC_ALCHEMY_ETHEREUM_MAINNET: string;
      NEXT_PUBLIC_ALCHEMY_POLYGON_MAINNET: string;
      NEXT_PUBLIC_ALPOLY_MAIN: string;
      NEXT_PUBLIC_ALPOLY_TEST: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_DISCORD_CLIENT_ID: string;
      NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
      NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN: string;
      NEXT_PUBLIC_LINKEDIN_CLIENT_ID: string;
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
      SIB_KEY: string;
      TWITTER_TOKEN: string;
      VAPID_PRIVATE_KEY: string;
      GEVENT_TOKENS_ADDR: string;
    }
  }
}

export {};