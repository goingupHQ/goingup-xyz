import { createContext, useContext } from 'react';
import { AppContext } from './app-context';

export const OrganizationsContext = createContext({});

export function OrganizationsProvider({ children }) {
    const app = useContext(AppContext);
    const organizations = [
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '1',
            logo: '/images/goingup-glyph.png',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '2',
            logo: '/images/goingup-glyph.png',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '3',
            logo: '/images/goingup-glyph.png',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '4',
            logo: '/images/goingup-glyph.png',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '5',
            logo: '/images/goingup-glyph.png',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '6',
            logo: '/images/goingup-glyph.png',
        },
    ];

    const value = { organizations };

    return (
        <OrganizationsContext.Provider value={value}>
            {children}
        </OrganizationsContext.Provider>
    );
}
