import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import React from 'react';
import NextLink from 'next/link';
import { WalletContext } from '../../contexts/wallet-context';
import { Stack } from '@mui/system';
import { Typography, Box, Avatar } from '@mui/material';
import Identicon from './Identicon';

export default function ProfileLink(props) {
    const { address, textSx } = props;
    const [name, setName] = React.useState(null);
    const [ensName, setEnsName] = React.useState(null);
    const [profilePhoto, setProfilePhoto] = React.useState(null);
    const wallet = React.useContext(WalletContext);

    const displayAddress = ethers.utils.isAddress(address) ? truncateEthAddress(address) : 'Invalid Address';

    React.useEffect(() => {
        //
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
        <NextLink href={`/profile/${address}`}>
            <Stack direction="row" spacing={2} sx={{ cursor: 'pointer' }} alignItems="center">
                {profilePhoto ? <Avatar src={profilePhoto} variant="circular" /> : <Identicon address={address} />}
                <Typography sx={textSx}>
                    {name === null ? ensName || displayAddress : `${name} (${ensName || displayAddress})`}
                </Typography>
            </Stack>
        </NextLink>
    );
}
