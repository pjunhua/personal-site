import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface UserContextType {
    accessToken: string;
    setAccessToken: (accessToken: string)=>void;
    loggedIn: React.RefObject<boolean>;
}

/* Define createContext to be used, default is undefined until used by LogInProvider. Context is basically a way to share 
   information throughout different React components without chaining it through their parents. */
export const LogInContext = createContext<UserContextType | undefined>(undefined);

interface LogInProviderProps {
    children: ReactNode;
}

// The component that'll be used by other react components, returns the JSX and holds the useState/useRef
export const LogInProvider: React.FC<LogInProviderProps> = ({ children }) => {

    // useState/useRef that's shared with the other components

    // Used to hold the access token, but also to trigger a re-render when set to indicate log in status
    const [accessToken, setAccessToken] = useState<string>('');

    // This has to be useRef to check if we're logged in to then display/do things differently, the delay that comes with useState is too long
    const loggedIn = useRef<boolean>(false);

    const value = { accessToken, setAccessToken, loggedIn };

    return (
        /* .Provider 'subscribes' LogInContext to components using LogInProvider, passing the context to LogInContext, making it no
            longer undefined. {children} automatically detects anything within <LogInProvider></LogInProvider> in App.tsx for example
            and substitutes it there. */
        <LogInContext.Provider value={value}>
            {children}
        </LogInContext.Provider>
    );
};

// This is the function components with LogInProvider will call to access the useState within the context
export const useLogIn = () => {
    const context = useContext(LogInContext);

    /* If undefined means that the component calling it doesn't have LogInProvider and thus isn't 'subscribed' to LogInContext, preventing access.
       Basically, to properly use useLogIn() to update the context, the componenet like Home.tsx or Navbar.tsx needs to be the child of
       <LogInProvider></LogInProvider> */
    if (context === undefined) {
        throw new Error('useLogIn must be used within a LogInProvider');
    }

    return context;
};