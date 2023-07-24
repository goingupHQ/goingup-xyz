export type EmailLoginCode = {
  code: string;
  email: string;
  expiresAt: Date;
};

export type AccessToken = {
  token: string;
  address: string;
  createdAt: Date;
};