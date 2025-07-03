import { useEffect, useState, useRef } from 'react';
import './Home.css';
import NavBar from '../../components/NavBar/NavBar';
import AboutMe from '../../sections/AboutMe/AboutMe';
import HeroWelcome from '../../sections/HeroWelcome/HeroWelcome';
import MyProjects from '../../sections/MyProjects/MyProjects';

export default function Home() {

    // Object to contain the refs to all sections so handleNavigate can search for the right ref with a key
    const navRefs = {
        home: useRef<HTMLElement | null>(null),
        about: useRef<HTMLElement | null>(null),
        projects: useRef<HTMLElement | null>(null),
    }

    const navKeys: string[] = Object.keys(navRefs);

    const currentSection = useRef<number>(0);

    type directionType = 'up' | 'down';

    // Receives the id of which nav element has been clicked to scroll to the right section
    const handleNavigate = (direction: directionType) => {
        const current = currentSection.current;
        const currentNavKey = navKeys[current] as keyof typeof navRefs;
        const currentNavRef = navRefs[currentNavKey];

        if (direction === 'up' && current > 0) {
            const previousNavKey = navKeys[current - 1] as keyof typeof navRefs;
            const previousNavRef = navRefs[previousNavKey];
            if (previousNavRef.current) {
                previousNavRef.current.classList.remove('sectionUp');
                currentSection.current--;
            }
        } else if (direction === 'down' && current < navKeys.length - 1) {
            if (currentNavRef.current) {
                currentNavRef.current.classList.add('sectionUp');
                currentSection.current++;
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

    const pauseScroll = useRef<boolean>(false);

    // Temporarily stops any scroll behaviour while a menu like 'Sign In' is active
    const handleScroll = (pause: boolean) => {
        pauseScroll.current = pause ? true : false;
    }

    // Gets the time where the event listener was last triggered
    const lastUpdate = useRef<number>(0);

    // Sets minimum delay before function in event listener can be triggered again
    const scrollDelay = 400;

    // Records the y axis at initial touch to determine the direction at the end of swipe
    const touchPoint = useRef<number | null>(null);

    /* == When scrolling on desktop == */
    const wheelHandler = (event: WheelEvent) => {

        if (pauseScroll.current) return;

        const now = Date.now();

        /* Gets the time difference of the current time from the last time this fn was triggered, then only 
           trigger this function if the set delay timing has passed */
        if (now - lastUpdate.current > scrollDelay) {

            // deltaY more than 0 means scrolling down, less than 0 means scrolling up
            if (event.deltaY > 0) {
                handleNavigate('down');
            } else if (event.deltaY < 0) {
                handleNavigate('up');
            }

            lastUpdate.current = now;

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
                    if (event.target.classList.contains('ignoreScrollDown')) return;
                    handleNavigate('down');
                } else if (swipeEndPoint > touchPoint.current && currentSection.current - 1 >= 0) {
                    if (event.target.classList.contains('ignoreScrollUp')) return;
                    handleNavigate('up');
                }
            }

            lastUpdate.current = now;
            touchPoint.current = null;
        }

    }

    window.addEventListener("touchmove", (event) => handleTouchMove(event));

    const [projectKey, setProjectKey] = useState<number>(0);
    useEffect(()=> {
        const observer = new ResizeObserver(()=>setProjectKey(current => current+1));
        observer.observe(document.body);

        return()=>{observer.disconnect()}
    }, [])

    return (
        <>
            <NavBar navigateRequest={(sectionId: keyof typeof navRefs) => { navigateJumpTo(sectionId) }} pauseScroll={(pause) => { handleScroll(pause) }} />
            <section className='hero-welcome-screen' ref={navRefs.home}>
                <HeroWelcome key={projectKey} />
            </section>
            <section className='about-me' id='about-me' ref={navRefs.about}>
                <AboutMe key={projectKey} />
            </section>
            <section className='my-projects' id='my-projects' ref={navRefs.projects}>
                <MyProjects key={projectKey} />
            </section>
        </>
    )
}
