import { useMediaQuery } from '@mui/material';
import { createContext, useEffect, useState, ReactNode } from 'react';
import convertVapidKey from 'convert-vapid-public-key';
import availability from './availability.json';
import occupations from './occupations.json';
import userGoals from './user-goals.json';

const maxReputationScore = 140;

export type Occupation = {
  id: number;
  text: string;
};

export type Availability = {
  id: number;
  text: string;
};

export type UserGoal = {
  id: number;
  text: string;
};

type AppContextData = {
  availability: Availability[];
  occupations: Occupation[];
  userGoals: UserGoal[];
  setDarkMode: () => void;
  setLightMode: () => void;
  maxReputationScore: number;
  mode: string;
  registerServiceWorker: () => Promise<ServiceWorkerRegistration | void>;
  subscribeUserToPush: () => Promise<PushSubscription | void>;
};

export const AppContext = createContext<AppContextData>({} as AppContextData);

type AppProviderProps = {
  children: ReactNode;
};

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  if (!('PushManager' in window)) {
    return;
  }

  const registration = await navigator.serviceWorker.register('/service-workers/push-notifications.js');
  console.log('Push Notifications Service Worker Registered');
  return registration;
};

const subscribeUserToPush = async () => {
  const registration = await registerServiceWorker();
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: convertVapidKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  };

  const subscription = await registration?.pushManager.subscribe(subscribeOptions);
  localStorage.setItem('psn-subscription', JSON.stringify(subscription));
  return subscription;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [mode, setMode] = useState('dark');
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // useEffect(() => {
  //   const cache = localStorage.getItem('color-mode');
  //   if (!cache) {
  //     // localStorage.setItem('color-mode', prefersDarkMode ? 'dark' : 'light');
  //     localStorage.setItem('color-mode', 'dark');
  //     setMode('dark');
  //   } else {
  //     setMode(cache);
  //   }

  //   registerServiceWorker();
  // }, [mode]);

  const setDarkMode = () => {
    localStorage.setItem('color-mode', 'dark');
    setMode('dark');
  };

  const setLightMode = () => {
    localStorage.setItem('color-mode', 'light');
    setMode('light');
  };

  const value: AppContextData = {
    availability: availability.sort((a, b) => a.text.localeCompare(b.text)),
    occupations: occupations.sort((a, b) => a.text.localeCompare(b.text)),
    userGoals: userGoals.sort((a, b) => a.text.localeCompare(b.text)),
    setDarkMode,
    setLightMode,
    maxReputationScore,
    mode,
    registerServiceWorker,
    subscribeUserToPush,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

