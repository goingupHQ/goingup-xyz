import { createContext } from "react";

export const utilityTokensContext = createContext();

const getUtilityTokens = async () => {
    const response = await fetch("/api/utility-tokens");
    const utilityTokens = await response.json();
    return utilityTokens;
};

export const utilityTokensProvider = ({ children }) => {
    return (
        <utilityTokensContext.Provider value={{
            getUtilityTokens,
        }}>
            {children}
        </utilityTokensContext.Provider>
    );
}