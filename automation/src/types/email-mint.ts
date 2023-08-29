export type EmailMintRequest = {
  mintFrom: {
    address: string;
    name: string;
  };
  mintTo: {
    address: string;
    name: string;
  };
  tokenId: number;
  qty: number;
  subject: string;
  content: {
    text: string;
    html: string;
  };
  confirmationId: string;
  confirmedBySenderOn?: Date;
  finalMintMessage?: string;
  qtyToMint?: number;
  tokenIdToMint?: number;
};

export type AllowedEmailMinter = {
  email: string;
  allowed: boolean;
};