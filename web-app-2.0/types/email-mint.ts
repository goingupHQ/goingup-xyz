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
};

export type AllowedEmailMinter = {
  email: string;
  allowed: boolean;
};

export type TokenRecipient = {
  doSend: boolean;
  mintToAddress: string;
  mintToName: string;
  mintToEmail: string;
  mintQuantity: number;
  mintTokenId: number;
};
