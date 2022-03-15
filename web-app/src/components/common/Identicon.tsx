import { useEffect, useRef } from 'react';
import Jazzicon from '@metamask/jazzicon';

interface IProps {
    address: string;
    size?: number;
}

export default function Identicon({ address, size }: IProps) {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (address && ref.current) {
            ref.current.innerHTML = '';
            ref.current.appendChild(
                Jazzicon(size || 36, parseInt(address.slice(2, 10), 16))
            );
        }
    }, [address]);

    return <div className="rounded" ref={ref as any} />;
}
