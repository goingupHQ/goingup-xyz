import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import React from 'react';
import NextLink from 'next/link';

export default function AccountNameAddress(props) {
    const { address } = props;
    const [name, setName] = React.useState(null);

    const displayAddress = ethers.utils.isAddress(address) ? truncateEthAddress(address) : 'Invalid Address';

    React.useEffect(() => {
        if (address) {
            fetch(`/api/get-account-name?address=${address}`).then(async (res) => {
                const result = await res.text();
                setName(result);
            });
        }
    }, [address]);

    return (
        <NextLink href={`/profile/${address}`}>
            {name === null ? displayAddress : `${name} (${displayAddress})`}
        </NextLink>
    );
}
