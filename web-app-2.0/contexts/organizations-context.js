import { createContext, useContext, useEffect, useState } from 'react';
import { AppContext } from './app-context';

export const OrganizationsContext = createContext({});

export function OrganizationsProvider({ children }) {
    const app = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [orgs, setOrgs] = useState([]);

    const logo = '/images/goingup-glyph.png';

    const getOrgs = async () => {
        const res = await fetch('/api/get-orgs');
        const data = await res.json();
        setOrgs(data);
        setLoading(false);
    };

    const value = { logo, loading, orgs, setOrgs, setLoading, getOrgs };

    return (
        <OrganizationsContext.Provider value={value}>
            {children}
        </OrganizationsContext.Provider>
    );
}
