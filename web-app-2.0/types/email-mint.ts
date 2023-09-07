import { ObjectId } from 'mongodb';

export type EmailMintRequest = {
  _id: string | ObjectId;
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
  emailSentToRecipient?: Date;
  acceptedByRecipient?: Date;
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
  requestId: string;
};
