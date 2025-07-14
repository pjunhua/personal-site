import { useEffect, useRef, isValidElement, cloneElement } from 'react';

type IgnoreScrollProps = {
    children: React.ReactElement<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>
}

export default function IgnoreScroll({ children }: IgnoreScrollProps) {

    const ignoreRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const iR = ignoreRef.current
        if (!iR) throw new Error('Ignore ref not detected at ignore scroll component');

        // If they're equal it means there's no scroll in this screen resolution, so we shouldn't block the navigation
        if (iR.scrollHeight === iR.clientHeight) {
            iR.classList.remove('ignoreScroll');
            return;
        }

        /* 
           Setup of ignoreNav for up/down page navigation based on how far the user has scrolled down.
           If they have not scrolled down yet, they should be allowed to scroll up a page but not down.
           If they are scrolled all the way down, they can scroll down to the next page but not up.
           This is to make it so while trying to read more of the overflow, it won't trigger the page navigation. 
           
           scrollHeight is the total height of the text including what's hidden, clientHeight is the total height
           of the visible text, and scrollTop is the length the user has scrolled from the top where 0 means they
           have not scrolled down at all, and scrollHeight - clientHeight means they've scrolled all the way to
           the bottom.

           We are using Math.ceil(scrollTop) as for some reason when testing on my mobile device, even though
           scrollHeight - clientHeight was 16 for example, scrollTop kept returning 15.xxx while I was scrolled
           all the way down. So it's a workaround for that scenario.
        */

        const handleScroll = () => {
            iR.classList.add('ignoreNavUp');
            iR.classList.add('ignoreNavDown');

            // Equal 0 means user has yet to scroll and is at the top of the scroll overflow, so they should be allowed to navigate up
            if (iR.scrollTop === 0) {
                // Timeout makes it so when user is scrolling up fast they don't accidentally trigger nav up
                setTimeout(() => iR.classList.remove('ignoreNavUp'), 500);
            }

            // scrollHeight - clientHeight gives the maximum scroll length, if scrollTop is equal to it, it means user has scrolled the full length to the very bottom and should be allowed to navigate down
            if (Math.ceil(iR.scrollTop) === iR.scrollHeight - iR.clientHeight) {
                // Timeout makes it so when user is scrolling down fast they don't accidentally trigger nav down
                setTimeout(() => iR.classList.remove('ignoreNavDown'), 500);
            }
        }

        iR.addEventListener('scroll', handleScroll);

        // Initial setup of ignoreNavUp/ignoreNavDown classes
        handleScroll();

        return () => {
            iR.removeEventListener('scroll', handleScroll);
        }

    }, []);

    if (isValidElement(children)) {
        return (
            <>
                {cloneElement(children, {
                    ref: ignoreRef,
                    style: {
                        ...children.props.style,
                        overflowY: 'auto',
                        scrollbarGutter: 'stable'
                    },
                    className: `${children.props.className ?? ''} ignoreScroll`
                })}
            </>
        )
    }


    // Fallback return when children is not a proper element (e.g. <IgnoreScroll>String</IgnoreScroll>, children is just a literal string, not a proper element that can receive classes or refs)
    return (
        <>
            {children}
        </>
    )
}