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
    },
    {
      text: 'QR Code Minting',
      to: `/organizations/${org.code}/qr-code-minting`
    }
    // {
    //   text: `Groups & Members`,
    //   to: `/organizations/${org.code}/groups-and-members`
    // },
  ]
};