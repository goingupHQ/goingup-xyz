import { ReactNode, useState, createContext, useEffect, Dispatch } from 'react';
import { Availability, Occupation, UserGoal } from './AppTypes';
import api, { WebAPI } from './WebAPI';

type AppContext = {
    availability: Array<Availability>;
    occupations: Array<Occupation>;
    userGoals: Array<UserGoal>;
    api: WebAPI;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppContext = createContext<AppContext>({} as AppContext);

type Props = {
    children: ReactNode;
};

const availability: Array<Availability> = [
    { id: 1, text: 'Actively looking for new projects' },
    { id: 2, text: 'Open for proposals' },
    { id: 3, text: 'Not looking for new projects' },
]

const occupations: Array<Occupation> = [
    { id: 1, text: 'Artist' },
    { id: 2, text: 'Developer' },
    { id: 3, text: 'Athlete' },
    { id: 4, text: 'Marketing & Community' },
    { id: 5, text: 'Investor' },
    { id: 6, text: 'Accountant' },
    { id: 7, text: 'Engineer' },
    { id: 8, text: 'Actor' },
    { id: 9, text: 'Video Producer' },
    { id: 10, text: 'Writer' },
    { id: 999, text: 'Other' },
]

const userGoals: Array<UserGoal> = [
    { id: 1, text: 'Launch an NFT project' },
    { id: 2, text: 'Collaborate in a creative project' },
    { id: 3, text: 'Find a job in a web3 company' },
    { id: 4, text: 'Work for a DAO' },
    { id: 5, text: 'Contribute to a community' },
]

export function AppProvider({ children }: Props) {
    return (
        <AppContext.Provider
            value={{
                availability,
                occupations,
                userGoals,
                api
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
