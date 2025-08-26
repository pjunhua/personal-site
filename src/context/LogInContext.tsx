import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

type uLIProps = {
    aT?: string | null,
    e?: string | null,
    sLI?: boolean | null
}

interface UserContextType {
    accessToken: React.RefObject<string>;
    accountEmail: React.RefObject<string>;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    updateLogIn: (props: uLIProps) => void;
    tokenUpdates: () => void;
    signOut: () => void;
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

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const accessToken = useRef<string>('');
    const accountEmail = useRef<string>('');

    const updateLogIn = ({ aT = null, e = null, sLI = null }: uLIProps) => {
        if (sLI === false) {
            accessToken.current = '';
            accountEmail.current = '';
            setLoggedIn(false);
        } else {
            if (aT !== null) accessToken.current = aT;
            if (e !== null) accountEmail.current = e;
            if (sLI !== null && sLI === true) setLoggedIn(true);
        }
    }

    // Invoked when updating an expired/missing Access Token, or to check if logged in, Refresh Token must exist and be valid
    const tokenUpdates = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tokenUpdates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ accessTokenJwt: accessToken.current })
        });

        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            return;
        }

        const result = await res.json();

        if (!result.validatePass) {
            // Means no valid Refresh Token, which can only be created by logging in, set access token to blank to indicate logged out
            updateLogIn({ sLI: false });
        } else {
            // Means valid Refresh Token with valid Access Token
            updateLogIn({ aT: result.value.accessToken, e: result.value.email, sLI: true });
        }
    }

    // Sends a fetch to remove the refreshToken
    const signOut = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/signOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            return;
        } else {
            updateLogIn({ sLI: false });
        }
    }

    // Verify log in status on boot
    useEffect(() => {
        const checkLoginStatus = async () => {
            await tokenUpdates();
        }

        checkLoginStatus();

        // eslint-disable-next-line
    }, []);

    const value = { accessToken, accountEmail, loggedIn, setLoggedIn, updateLogIn, tokenUpdates, signOut };

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