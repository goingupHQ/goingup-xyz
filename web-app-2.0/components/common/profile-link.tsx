import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import React from 'react';
import NextLink from 'next/link';
import { Stack } from '@mui/system';
import { Typography, Avatar } from '@mui/material';
import Identicon from './Identicon';

type ProfileLinkProps = {
  address: string;
  onClick?: () => void;
};

export default function ProfileLink({ address, onClick }: ProfileLinkProps) {
  const [name, setName] = React.useState<string | null>(null);
  const [ensName, setEnsName] = React.useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);

  const displayAddress = ethers.utils.isAddress(address) ? truncateEthAddress(address) : 'Invalid Address';

  React.useEffect(() => {
    if (address) {
      fetch(`/api/get-account-small?address=${address}`).then(async (res) => {
        const result = await res.json();
        setName(result.name);
        setProfilePhoto(result.profilePhoto);
        // setEnsName(await wallet.mainnetENSProvider.lookupAddress(address));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <NextLink
      href={`/profile/${address}`}
      onClick={onClick}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ cursor: 'pointer' }}
        alignItems="center"
      >
        {profilePhoto ? (
          <Avatar
            src={profilePhoto}
            variant="circular"
          />
        ) : (
          <Identicon
            address={address}
            size={36}
          />
        )}
        <Typography>{name === null ? ensName || displayAddress : `${name} (${ensName || displayAddress})`}</Typography>
      </Stack>
    </NextLink>
  );
}
