import { createContext, useContext } from 'react';
import { AppContext } from './app-context';

export const OrganizationsContext = createContext({});

export function OrganizationsProvider({ children }) {
    const app = useContext(AppContext);
    const organizations = [
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',
            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',

            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',

            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',

            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',

            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
        {
            name: 'GoingUp',
            description: 'Web3 Protocol for reputation & identity description',
            address: '0x5f4eC3D',

            logo:
                app.mode === 'dark'
                    ? '/images/goingup-logo-dark.svg'
                    : '/images/goingup-logo-light.svg',
        },
    ];

    const value = { organizations };

    return (
        <OrganizationsContext.Provider value={value}>
            {children}
        </OrganizationsContext.Provider>
    );
}
