import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

type NavRefsType = {
    home: React.RefObject<HTMLElement | null>,
    about: React.RefObject<HTMLElement | null>,
    projects: React.RefObject<HTMLElement | null>,
    info: React.RefObject<HTMLElement | null>
}

interface NavContextType {
    navRefs: NavRefsType,
    handleNavigate: (direction: 'up' | 'down') => void,
    navigateJumpTo: (section: keyof NavRefsType) => void,
    pauseScroll: React.RefObject<boolean>
}

/* Define createContext to be used, default is undefined until used by NavProvider. Context is basically a way to share 
   information throughout different React components without chaining it through their parents. */
export const NavContext = createContext<NavContextType | undefined>(undefined);

interface NavProviderProps {
    children: ReactNode;
}

// The component that'll be used by other react components, returns the JSX and holds the useState/useRef
export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {

    // Object to contain the refs to all sections so handleNavigate can search for the right ref with a key
    const navRefs = {
        home: useRef<HTMLElement | null>(null),
        about: useRef<HTMLElement | null>(null),
        projects: useRef<HTMLElement | null>(null),
        info: useRef<HTMLElement | null>(null)
    }

    const navKeys: string[] = Object.keys(navRefs);

    const currentSection = useRef<number>(0);

    type directionType = 'up' | 'down';

    // Receives the id of which nav element has been clicked to scroll to the right section
    const handleNavigate = (direction: directionType) => {
        const current = currentSection.current;
        const currentNavKey = navKeys[current] as keyof typeof navRefs;
        const currentNavRef = navRefs[currentNavKey];

        const previousNavKey = navKeys[current - 1] as keyof typeof navRefs;
        const previousNavRef = navRefs[previousNavKey];

        const nextNavKey = navKeys[current + 1] as keyof typeof navRefs;
        const nextNavRef = navRefs[nextNavKey];

        if (direction === 'up' && current > 0) {
            if (previousNavRef.current && currentNavRef.current) {
                previousNavRef.current.classList.remove('sectionUp');
                previousNavRef.current.classList.add('active');

                currentNavRef.current.classList.remove('active');
                currentSection.current--;
            }
        } else if (direction === 'down' && current < navKeys.length - 1) {
            if (currentNavRef.current && nextNavRef.current) {
                currentNavRef.current.classList.add('sectionUp');
                currentNavRef.current.classList.remove('active');
                currentSection.current++;

                nextNavRef.current.classList.add('active');
            }
        }
    }

    const navigateJumpTo = (section: keyof typeof navRefs) => {
        const targetSectionIndex = navKeys.indexOf(section);
        // Gets how many sections away the target we're navigating to is from the current section
        const distance = targetSectionIndex - currentSection.current;

        // Distance more than 0 means scrolling down, distance less than 0 means scrolling up
        if (distance > 0) {
            for (let i = 0; i < distance; i++) {
                handleNavigate('down');
            }
        } else if (distance < 0) {
            for (let i = 0; i < -distance; i++) {
                handleNavigate('up');
            }
        }
    }

    /* == Scroll Related Declarations == */

    // Temporarily stops any scroll behaviour while a menu like 'Sign In' is active
    const pauseScroll = useRef<boolean>(false);

    // Gets the time where the event listener was last triggered
    const lastUpdate = useRef<number>(0);

    // Sets minimum delay before function in event listener can be triggered again
    const scrollDelay = 400;

    // Records the y axis at initial touch to determine the direction at the end of swipe
    const touchPoint = useRef<number | null>(null);

    useEffect(() => {

        /* == When scrolling on desktop == */
        const wheelHandler = (event: WheelEvent) => {

            if (pauseScroll.current) return;

            const now = Date.now();

            if (event.target instanceof Element) {

                /* Gets the time difference of the current time from the last time this fn was triggered, then only 
                   trigger this function if the set delay timing has passed */
                if (now - lastUpdate.current > scrollDelay) {

                    // deltaY more than 0 means scrolling down, less than 0 means scrolling up
                    if (event.deltaY > 0) {
                        if (event.target.closest('.ignoreNavDown')) return;
                        handleNavigate('down');
                    } else if (event.deltaY < 0) {
                        if (event.target.closest('.ignoreNavUp')) return;
                        handleNavigate('up');
                    }

                    lastUpdate.current = now;

                }
            }

        }

        // Know the starting touch point to determine the direction swiped
        window.addEventListener('wheel', (event) => wheelHandler(event));

        /* == When scrolling on mobile == */

        // Gets y axis of initial touch point to use as reference when there's a swipe
        const handleTouchStart = (event: TouchEvent) => {
            if (pauseScroll.current) return;
            if (event.target instanceof Element) {
                if (event.target.classList.contains('ignoreScroll')) {
                    /* Need to set it to null as touchMove will still trigger based on the last touchPoint.
                       Example scenario is when you click on something but don't move. touchPoint will be set, but since
                       handleTouchMove wasn't triggered, it isn't reset to null. So now, even if you swipe on a target with
                       the ignoreScroll class, it will skip handleTouchStart, but since we already have a touchPoint value,
                       handleTouchMove will execute based off of it, which isn't intended. */
                    touchPoint.current = null;
                    return;
                };
            }
            touchPoint.current = event.touches[0].clientY;
        }

        window.addEventListener("touchstart", (event) => handleTouchStart(event));

        // When there's a swipe on mobile, get the ending point, based on it and the initial touch we can determine whether the direction of the swipe
        const handleTouchMove = (event: TouchEvent) => {

            if (pauseScroll.current || !touchPoint.current) return;

            const now = Date.now();

            // Avoids multiple triggers to update touchPoint
            if (now - lastUpdate.current > scrollDelay) {
                let swipeEndPoint = event.touches[0].clientY;

                if (event.target instanceof Element) {
                    /* If swipeEndPoint is lower than touchPoint, it means the user swiped up, which in mobile orientation means the user is trying to
                       scroll down, so we follow the same logic as with the scroll listener. Conversely, if swipeEndPoint is higher than touchPoint, it
                       means the user swiped down to a lower point, which means they were trying to scroll up */
                    if (swipeEndPoint < touchPoint.current && currentSection.current + 1 < navKeys.length) {
                        if (event.target.closest('.ignoreNavDown')) return;
                        handleNavigate('down');
                    } else if (swipeEndPoint > touchPoint.current && currentSection.current - 1 >= 0) {
                        if (event.target.closest('.ignoreNavUp')) return;
                        handleNavigate('up');
                    }
                }

                lastUpdate.current = now;
                touchPoint.current = null;
            }

        }

        window.addEventListener("touchmove", (event) => handleTouchMove(event));

        return()=>{
        window.removeEventListener('wheel', (event) => wheelHandler(event));
        window.removeEventListener("touchstart", (event) => handleTouchStart(event));
        window.removeEventListener("touchmove", (event) => handleTouchMove(event));
        }
    }, [])

    const value = { navRefs, handleNavigate, navigateJumpTo, pauseScroll };

    return (
        /* .Provider 'subscribes' NavContext to components using NavProvider, passing the context to NavContext, making it no
            longer undefined. {children} automatically detects anything within <NavProvider></NavProvider> in App.tsx for example
            and substitutes it there. */
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    );
};

// This is the function components with NavProvider will call to access the useState within the context
export const useNav = () => {
    const context = useContext(NavContext);

    /* If undefined means that the component calling it doesn't have NavProvider and thus isn't 'subscribed' to NavContext, preventing access.
       Basically, to properly use useNav() to update the context, the componenet like Home.tsx or Navbar.tsx needs to be the child of
       <NavProvider></NavProvider> */
    if (context === undefined) {
        throw new Error('useNav must be used within a NavProvider');
    }

    return context;
};