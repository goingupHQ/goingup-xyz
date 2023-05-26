export type Account = {
  name: string;
  occupation?: number;
  openTo?: number[];
  projectGoals?: number[];
  idealCollab?: number[];
  address?: string;
  coverPhoto?: string;
  profilePhoto?: string;
  twitterUser?: TwitterUser;
  githubUser?: GithubUser;
  linkedInUser?: LinkedInUser;
  discordUser?: DiscordUser;
  email?: string;
  reputationScore: number;
  discord?: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  projects?: Project[];
  chain: string;
  mintedUtilityTokens?: MintedUtilityToken[];
  about?: string;
  projectImage?: string;
  isDeleted?: boolean | string;
  isCustodial?: boolean;
  encryptedPrivateKey?: string;
  createdAt?: Date;
  custodialOnboarded?: boolean;
}

type MintedUtilityToken = {
  tokenId: TokenId;
  timestamp: string | number;
}

type TokenId = {
  _hex: string;
  _isBigNumber: boolean;
}

type Project = {
  title: string;
  description: string;
  completion: string;
  skills: string[];
  projectUrl: string;
}

type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner?: string;
  banner_color?: string;
  accent_color?: number;
  locale: string;
  mfa_enabled: boolean;
  email: string;
  verified: boolean;
  avatar_decoration?: any;
  premium_type?: number;
}

type LinkedInUser = {
  localizedLastName: string;
  profilePicture?: ProfilePicture;
  firstName: LinkedInName;
  lastName: LinkedInName;
  id: string;
  localizedFirstName: string;
}

type LinkedInName = {
  localized: Localized;
  preferredLocale: PreferredLocale;
}

type PreferredLocale = {
  country: string;
  language: string;
}

type Localized = {
  en_US?: string;
  zh_CN?: string;
}

type ProfilePicture = {
  displayImage: string;
}

type GithubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name?: string;
  company?: any;
  blog: string;
  location?: string;
  email?: string;
  hireable?: boolean;
  bio?: string;
  twitter_username?: any;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

type TwitterUser = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export type AddressOrAccountSearchResult = {
  address: string;
  name?: string;
  profilePhoto?: string;
};