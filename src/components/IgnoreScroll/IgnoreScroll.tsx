import { useEffect, useRef, isValidElement, cloneElement } from 'react';

type IgnoreScrollProps = {
    children: React.ReactElement<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>
}

export default function IgnoreScroll({ children }: IgnoreScrollProps) {

    const ignoreRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const iR = ignoreRef.current
        if (!iR) throw new Error('Ignnore ref not detected at ignore scroll component');

        /* 
           Setup of ignore scrolls for page navigation based on how far the user has scrolled down.
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

        const handleOnScrollEnd = () => {
            if (iR.scrollTop === 0) {
                iR.classList.remove('ignoreScrollUp');
            } else if (Math.ceil(iR.scrollTop) === iR.scrollHeight - iR.clientHeight) {
                iR.classList.remove('ignoreScrollDown');
            }
        }

        const handleOnPointerDown = () => {
            // Not equal 0 means user has already scrolled down, so we should ignoreScrollUp for the navigation so the user can scroll up on the text
            if (iR.scrollTop !== 0) {
                iR.classList.add('ignoreScrollUp');
            }

            /* scrollHeight is the total height of the text including what's hidden, clientHeight is the total height of the visible text.
               So scrollHeight - clientHeight will give the maximum amount of length you can scroll. If scrollTop is not at equal to the
               maximum point, it means there is still more content to scroll down to, as such, we should ignoreScrollDown for the navigation
               so the user can scroll down on the text. */
            if (Math.ceil(iR.scrollTop) !== iR.scrollHeight - iR.clientHeight) {
                iR.classList.add('ignoreScrollDown');
            }

            iR.removeEventListener('scrollend', handleOnScrollEnd);
            iR.addEventListener('scrollend', handleOnScrollEnd);
        }

        // Removes any current listeners to prevent stacking
        iR.removeEventListener('pointerdown', () => handleOnPointerDown());

        // If they're not the same it means there's overflow
        if (iR.clientHeight !== iR.scrollHeight) {
            iR.addEventListener('pointerdown', () => handleOnPointerDown());
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
                    }
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