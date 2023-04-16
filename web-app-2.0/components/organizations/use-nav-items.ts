import { Organization } from "@/types/organization";

export const useNavItems = (org?: Organization | null) => {
  if (!org) return [];

  return [
    {
      text: `Org Page`,
      to: `/organizations/${org.code}`
    },
    {
      text: `Owners`,
      to: `/organizations/${org.code}/owners`
    },
    {
      text: `Reward Tokens`,
      to: `/organizations/${org.code}/reward-tokens`
    }
  ]
};