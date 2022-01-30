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
    { id: 0, text: 'Actively looking for new projects' },
    { id: 1, text: 'Open for proposals' },
    { id: 2, text: 'Not looking for new projects' },
]

const occupations: Array<Occupation> = [
    { id: 0, text: 'Artist' },
    { id: 1, text: 'Developer' },
    { id: 2, text: 'Athlete' },
    { id: 3, text: 'Marketing & Community' },
    { id: 4, text: 'Investor' },
    { id: 5, text: 'Accountant' },
    { id: 6, text: 'Engineer' },
    { id: 7, text: 'Actor' },
    { id: 8, text: 'Video Producer' },
    { id: 9, text: 'Writer' },
    { id: 999, text: 'Other' },
]

const userGoals: Array<UserGoal> = [
    { id: 0, text: 'Launch an NFT project' },
    { id: 1, text: 'Collaborate in a creative project' },
    { id: 2, text: 'Find a job in a web3 company' },
    { id: 3, text: 'Work for a DAO' },
    { id: 4, text: 'Contribute to a community' },
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
