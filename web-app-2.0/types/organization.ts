export type Organization = {
  code: string;
  name: string;
  shortDescription: string;
  category?: string;
  network?: string;
  year: string;
  website?: string;
  twitter: string;
  discord?: string;
  description?: string;
  logo: string;
  owners?: string[];
  rewardTokens?: number[];
};

export type OrganizationGroup = {
  code: string;
  orgCode: string;
  name: string;
  description: string;
  members: OrganizationGroupMember[];
};

export type OrganizationGroupMember = {
  address: string;
  name: string;
  remarks: string;
};