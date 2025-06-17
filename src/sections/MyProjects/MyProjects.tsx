import { useEffect, useState, useRef, act } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './MyProjects.css';

export default function MyProjects() {

    type projectCard = {
        bannerImageUrl: string,
        title: string,
        description: string,
        index: number
    }

    const projectCard1: projectCard = {
        bannerImageUrl: "url('/img/transparent_profile.png')",
        title: 'Yo1',
        description: 'Yoyo1',
        index: 0
    }

    const projectCard2: projectCard = {
        bannerImageUrl: "url('/img/card1/abm1-bl.png')",
        title: 'Yo2',
        description: 'Yoyo2',
        index: 1
    }

    const projectCard3: projectCard = {
        bannerImageUrl: "url('/img/card1/abm1-br.png')",
        title: 'Yo3',
        description: 'Yoyo3',
        index: 2
    }

    const projectCard4: projectCard = {
        bannerImageUrl: "url('/img/card1/abm1-tl.png')",
        title: 'Yo4',
        description: 'Yoyo4',
        index: 3
    }

    const projectCard5: projectCard = {
        bannerImageUrl: "url('/img/card1/abm1-tr.png')",
        title: 'Yo5',
        description: 'Yoyo5',
        index: 4
    }

    // Array of all the project cards available, intended to hold any amount, fixed and will never change
    const projectArray = [projectCard1, projectCard2, projectCard3, projectCard4, projectCard5];

    // Array of the project cards that will be displayed, intended to only hold 5 for desktop, and 1 for smaller views
    const [displayArray, setDisplayArray] = useState<projectCard[]>([]);
    const displayArrayRef = useRef<projectCard[]>([]);

    const [displayProjectCard, setDisplayProjectCard] = useState<projectCard>({ bannerImageUrl: '', title: '', description: 'aa', index: 0 });

    const [translateX, setTranslateX] = useState<string>('0');

    const [transition, setTransition] = useState<boolean>(true);

    const generateNextProjectCard = (direction: 'left' | 'right') => {
        switch (direction) {
            case 'left':
                let newArrayLeft = [...displayArray];
                const farLeftIndex = newArrayLeft[0].index;
                let newLeftCard = projectArray.filter(projectCard => projectCard.index === farLeftIndex - 1)[0];
                if (newLeftCard === undefined) {
                    newLeftCard = projectArray[projectArray.length - 1];
                }
                newArrayLeft.unshift(newLeftCard);
                setDisplayArray(newArrayLeft);

                /* Seperately updates the array useRef to how the final array should look to handle later.
                   Directly updating the array useState with .pop or .shift will conflict with the ongoing transitions. */
                const newArrayLeftRef = displayArrayRef.current
                newArrayLeftRef.unshift(newLeftCard)
                newArrayLeftRef.pop();
                break;
            case 'right':
                let newArrayRight = [...displayArray];
                const farRightIndex = newArrayRight[newArrayRight.length - 1].index;
                let newRightCard = projectArray.filter(projectCard => projectCard.index === farRightIndex + 1)[0];
                if (newRightCard === undefined) {
                    newRightCard = projectArray[0];
                }
                newArrayRight.push(newRightCard);
                setDisplayArray(newArrayRight);

                /* Seperately updates the array useRef to how the final array should look to handle later.
                   Directly updating the array useState with .pop or .shift will conflict with the ongoing transitions. */
                const newArrayRightRef = displayArrayRef.current
                newArrayRightRef.push(newRightCard)
                newArrayRightRef.shift();
                break;
        }
    }

    const moveLeft = () => {
        if (!transition) return;
        setTranslateX(current => `${parseFloat(current) + 20}%`);
    }

    const moveRight = () => {
        if (!transition) return;
        setTranslateX(current => `${parseFloat(current) - 20}%`);
    }

    const handleTransitionEnd = () => {

        // If transition ends due to grab moving, don't handle it the normal way
        if (isGrabbing.current) return;

        // Slight delay to let any ongoing transition finish, because for some reason onTransitionEnd seems to trigger a bit before the transition actually ends
        setTimeout(() => {
            const tXPercentValue = parseFloat(translateX);
            if (tXPercentValue > 0) {
                for (let i = 0; i < tXPercentValue / 20; i++) {
                    generateNextProjectCard('left');
                }
            } else if (tXPercentValue < 0) {
                for (let i = 0; i < tXPercentValue / -20; i++) {
                    generateNextProjectCard('right');
                }
            }
            /* Adjusts the display to remove any extra unnecessary projectCards while readjusting the translateX back to the original to align the view,
               while at the same time turning off the transition animation to prevent the setTranslateX(0) from creating a weird rollback visual */
            setTransition(false);
            setDisplayArray(displayArrayRef.current);
            setActiveCard(displayArrayRef.current);
            setTranslateX('0');
        }, 200)

    }

    // Code that only triggers when translateX changes
    useEffect(() => {

        // If transition ends due to grab moving, don't handle it the normal way
        if (isGrabbing.current) return;

        const tXPercentValue = parseFloat(translateX);
        // Only turn on the transition once translateX has been set back to 0 by handleTransitionEnd
        if (tXPercentValue === 0 && !transition) {
            // Slight delay to let any ongoing transition finish, because for some reason onTransitionEnd seems to trigger a bit before the transition actually ends
            setTimeout(() => setTransition(true), 100);
        }
    }, [translateX])

    // Based on the displayArray, set margin left to center the intended project cards
    const [marginLeft, setMarginLeft] = useState<number>(0);

    const setActiveCard =(array: projectCard[])=> {
        const activeIndex = Math.floor(array.length/2);
        const activeCard = array[activeIndex];
        setDisplayProjectCard(activeCard);
    }

    // Triggers at the start to setup the display array according to how many project cards there are
    useEffect(() => {
        console.log(displayProjectCard.description)
        switch (projectArray.length) {
            case 5:
                const array = [...projectArray, ...projectArray, ...projectArray]
                setDisplayArray(array);
                displayArrayRef.current = array;
                setMarginLeft(-100);
                setActiveCard(array);
                break;
        }
    }, []);

    const activeProjectCardRef = useRef<HTMLDivElement | null>(null);

    const jumpToProject = (selectedId: number) => {
        const aPCR = activeProjectCardRef.current;
        if (!aPCR) throw new Error('Main project card ref not detected at jump');
        const centerId = aPCR.id;
        const difference: number = Number(centerId) - selectedId;
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                moveLeft();
            }
        } else if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                moveRight();
            }

        }
    }

    const initialGrabX = useRef<number | null>(null);

    const isGrabbing = useRef<boolean>(false);

    const handleMouseDown = (event: React.MouseEvent) => {

        const aPCR = activeProjectCardRef.current;
        if (!aPCR) throw new Error('Main project card ref not detected at mouse down');

        // Records the starting x axis
        initialGrabX.current = event.screenX;

        // Lets the system know mouse is held down to pause any normal transition handlers
        isGrabbing.current = true;

        // Give visual feedback that the grab mode is in on
        aPCR.style.cursor = 'grabbing'

    }

    const handleMouseMove = (event: React.MouseEvent) => {

        const aPCR = activeProjectCardRef.current;
        if (!aPCR) throw new Error('Main project card ref not detected at mouse move');

        // Only does something when the mouse currently being held down
        if (initialGrabX.current !== null) {
            const distanceMoved = event.screenX - initialGrabX.current;
            setTranslateX(`${distanceMoved}px`);

            const cardWidth = aPCR.getBoundingClientRect().width;

            /* Less than 0 means dragging it to the left, which indicates trying to move it to the right.
               More than 0 means dragging it to the right, which indicates trying to move it to the left.*/
            if (distanceMoved < 0) {
                // Gets number of cards that have passed based on how far to the right the carousel has moved
                const cardsMoved = Math.floor(distanceMoved/cardWidth);
                const newActive = displayArray[7+cardsMoved];
                setDisplayProjectCard(newActive);
            }
        }
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        // Clears the starting x axis to let the system know mouse is no longer held down
        initialGrabX.current = null;
    }

    return (
        <>
            <div className='projectMainDisplay' onClick={moveLeft}>
                <p style={{margin: '0'}}>{displayProjectCard.description}</p>
            </div>
            <div className='carouselCover'>
                <div className='inactiveCover'></div>
                <div className='activeCover'></div>
                <div className='inactiveCover'></div>
            </div>
            <div className='carousel' onTransitionEnd={() => handleTransitionEnd()} style={{ transform: `translateX(${translateX})`, transition: transition ? 'transform linear 0.2s' : 'none', marginLeft: `${marginLeft}%` }}>
                {
                    displayArray.map((project, index) => {

                        // Considers the center project card active
                        const active: boolean = index === Math.floor(displayArray.length / 2);

                        const projectHandlers = active ? {
                            onMouseDown: (e: React.MouseEvent) => handleMouseDown(e),
                            onMouseMove: (e: React.MouseEvent) => handleMouseMove(e),
                            onMouseUp: (e: React.MouseEvent) => handleMouseUp(e)
                        } : { onClick: () => jumpToProject(index) }

                        return (<div ref={active ? activeProjectCardRef : null} className='projectCard' id={`${index}`} style={{ backgroundImage: project.bannerImageUrl, cursor: active ? 'grab' : 'pointer' }} {...projectHandlers}>
                            <p className='projectTitle'>{project.title}</p>
                        </div>)
                    })
                }
            </div>
        </>
    )
}