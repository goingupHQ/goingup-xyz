import { createContext, useEffect, useState } from "react";

export const UtilityTokensContext = createContext();

const getUtilityTokens = async () => {
    const response = await fetch("/api/utility-tokens");
    const utilityTokens = await response.json();
    return utilityTokens;
};

export const UtilityTokensProvider = ({ children }) => {
    const [utilityTokens, setUtilityTokens] = useState([]);

    useEffect(() => {
        getUtilityTokens().then((utilityTokens) => {
            setUtilityTokens(utilityTokens);
        });
    }, []);

    return (
        <UtilityTokensContext.Provider value={{
            utilityTokens,
            getUtilityTokens,
        }}>
            {children}
        </UtilityTokensContext.Provider>
    );
}