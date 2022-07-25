// @ts-nocheck
import { ReactNode, useState, createContext, useEffect, Dispatch, useContext } from 'react';
import { Availability, Occupation, UserGoal } from './AppTypes';
import { WalletContext } from './WalletContext';
import api, { WebAPI } from './WebAPI';

type AppContext = {
    availability: Array<Availability>;
    occupations: Array<Occupation>;
    userGoals: Array<UserGoal>;
    api: WebAPI;
    maxReputationScore: number;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppContext = createContext<AppContext>({} as AppContext);

type Props = {
    children: ReactNode;
};

const availability: Array<Availability> = [
    { id: 1, text: 'Philanthropy' },
    { id: 2, text: 'Investing' },
    { id: 3, text: 'Volunteering' },
    { id: 4, text: 'Live Streaming' },
    { id: 5, text: 'Writing' },
    { id: 6, text: 'Advising' },
    { id: 7, text: 'Volunteering' },
    { id: 8, text: 'Full-time Roles' },
    { id: 9, text: 'Part-time Roles' },
    { id: 10, text: 'Open Source Contributions' },
    { id: 11, text: 'Activism' },
    { id: 12, text: 'Raising Funds' },
    { id: 13, text: 'Artist Management' },
    { id: 14, text: 'Content Creation' },
    { id: 15, text: 'Hiring' },
    { id: 16, text: 'Volunteering' },
    { id: 17, text: 'NFT Projects' },
    { id: 18, text: 'Joining DAOs' },
    { id: 19, text: 'Co-founding Companies' },
    { id: 20, text: 'Mentoring' }
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

const maxReputationScore = 140;

export function AppProvider({ children }: Props) {
    const wallet = useContext(WalletContext);
    const [notifications, setNotifications] = useState<Array<string>>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

    const getNotifications = async () => {
        console.log('getting notifications for user:', wallet.address);
        if (wallet.address) {
            const response = await fetch(`/api/get-notifications?address=${wallet.address}`);

            if (response.status === 200) {
                const result = await response.json();
                const unreadCount = result.filter(n => !n.read).length;
                setNotifications(result);
                setUnreadNotifications(unreadCount);
            } else {
                console.error(`Error getting notifications: ${response.status}`);
            }
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (wallet.address) {
            await fetch(`/api/mark-notifs-read?address=${wallet.address}`);
            const mapped = notifications.map(n => ({ ...n, read: true }));
            setUnreadNotifications(0);
            setNotifications(mapped);
        }
    };

    let notificationsInterval;
    useEffect(() => {
        getNotifications();

        if (notificationsInterval) clearInterval(notificationsInterval);
        notificationsInterval = setInterval(() => {
            getNotifications();
        }, 10000);
    }, [wallet.address]);
    return (
        <AppContext.Provider
            value={{
                availability,
                occupations,
                userGoals,
                api,
                maxReputationScore,
                notifications,
                unreadNotifications,
                markAllNotificationsAsRead
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
