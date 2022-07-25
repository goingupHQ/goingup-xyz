import { useEffect, useRef } from 'react';
import Jazzicon from '@metamask/jazzicon';

export default function Identicon({ address, size }) {
    const ref = useRef();

    useEffect(() => {
        if (address && ref.current) {
            ref.current.innerHTML = '';
            ref.current.appendChild(
                Jazzicon(size || 36, parseInt(address.slice(2, 10), 16))
            );
        }
    }, [address, size]);

    return <div className="rounded" ref={ref} />;
}
