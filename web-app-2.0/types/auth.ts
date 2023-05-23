export type EmailLoginCode = {
  code: string;
  email: string;
  expiresAt: Date;
};

export type AuthToken = {
  token: string;
  address: string;
  createdAt: Date;
};