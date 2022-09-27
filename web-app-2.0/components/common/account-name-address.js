import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import React from 'react';
import NextLink from 'next/link';
import { WalletContext } from '../../contexts/wallet-context';

export default function AccountNameAddress(props) {
    const { address } = props;
    const [name, setName] = React.useState(null);
    const [ensName, setEnsName] = React.useState(null);
    const wallet = React.useContext(WalletContext);

    const displayAddress = ethers.utils.isAddress(address) ? truncateEthAddress(address) : 'Invalid Address';

    React.useEffect(() => {
        //
        if (address) {
            fetch(`/api/get-account-name?address=${address}`).then(async (res) => {
                const result = await res.text();
                setName(result);
                setEnsName(await wallet.mainnetENSProvider.lookupAddress(address));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return (
        <>
            {name === null ? (ensName || displayAddress) : `${name} (${ensName || displayAddress})`}
        </>
    );
}
