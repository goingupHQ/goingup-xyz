import { ReactNode, useState, createContext, useEffect, Dispatch } from 'react';

type Availability = {
    id: string;
    text: string;
}

type AppContext = {
    availability: Array<Availability>;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppContext = createContext<AppContext>({} as AppContext);

type Props = {
    children: ReactNode;
};

const availability: Array<Availability> = [
    { id: 'actively-looking', text: 'Actively looking for new projects' },
    { id: 'open-for-proposals', text: 'Open for proposals' },
    { id: 'not-looking', text: 'Not looking for new projects' },
]

export function AppProvider({ children }: Props) {
    return (
        <AppContext.Provider
            value={{
                availability
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
