import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, wrap, useAnimationControls } from 'framer-motion';
import './MyProjects.css';
import IgnoreScroll from '../../components/IgnoreScroll/IgnoreScroll';
import { projectCard, projectArray } from './ProjectCardData';

export default function MyProjects() {

    const mainVideoRef = useRef<HTMLVideoElement | null>(null);
    const bgVideoRef = useRef<HTMLVideoElement | null>(null);

    const pauseVideos = () => {
        const mVR = mainVideoRef.current;
        const bVR = bgVideoRef.current;

        if (mVR && bVR) {
            mVR.pause();
            bVR.pause();
        }
    }

    // For when the main video is paused via media buttons, the bgVideo will keep playing otherwise
    const pauseBgVideo =()=> {
        const bVR = bgVideoRef.current;
        if (bVR) {
            bVR.pause();
        }
    }

    const playVideos = () => {
        const mVR = mainVideoRef.current;
        const bVR = bgVideoRef.current;

        if (mVR && bVR) {
            // If play is triggered while a video is being loaded it'll throw an error that needs to be handled, we have onCanPlay on the actual video html itself to play once it's ready
            mVR.play().catch((e) => console.log(e));
            bVR.play().catch((e) => console.log(e));
        }
    }

    // For when the main video has resumed playing via media buttons, the bgVideo will remain paused otherwise
    const playBgVideo =()=> {
        const bVR = bgVideoRef.current;
        if (bVR) {
            bVR.play();
        }
    }

    const toggleMuteVideo = () => {
        const mVR = mainVideoRef.current;

        if (!mVR) throw new Error('Main video player not detected at toggle');

        if (mVR.muted) {
            mVR.muted = false;
        } else {
            mVR.muted = true;
        }
    }

    type displayObject = {
        card: projectCard,
        position: number
    }

    // Array of the project cards that will be displayed, intended to only hold 5 for desktop, and 1 for smaller views
    const [displayArray, setDisplayArray] = useState<displayObject[]>([]);

    const x = useMotionValue(0); // Track X motion
    const startX = useRef(0);
    const generateDirection = useRef<'left' | 'right' | 'none'>('none');

    const getIndex = (value: number) => {
        return wrap(0, projectArray.length, value);
    }

    const controller = useAnimationControls();

    const snapToClosest = () => {
        /* Prevents triggers while it's still snapping to the right position, also prevents its own movement
           from triggering the animationComplete handler to trigger another snap. */
        if (midSnap.current) return;
        midSnap.current = true;
        setTimeout(() => midSnap.current = false, 500);

        const currentX = x.get();
        const width = cardWidth.current;

        const excessX = currentX % width;
        let newX = 0;

        if (Math.abs(excessX) > width / 2) {
            const remainderX = width - Math.abs(excessX);
            newX = excessX < 0 ? currentX - remainderX : currentX + remainderX;
        } else {
            newX = currentX - excessX;
        }

        controller.start({
            x: newX,
            transition: { duration: 0.2 }
        });
    }

    const generateCard = (direction: 'left' | 'right') => {
        switch (direction) {
            case 'left':
                generateDirection.current = 'left'

                const farLeftCard = displayArray[0];
                const farLeftCardId = farLeftCard.card.id;
                const farLeftCardPosition = farLeftCard.position;

                /* If farLeftCardId is 0, -1 wouldn't be a valid index and we would have to create a handler for it.
                   But with the wrap() in getIndex, -1 will become the maximum value as intended. */
                const indexLeft = getIndex(farLeftCardId - 1);
                let newLeftCard = projectArray[indexLeft];
                const newLeftObject: displayObject = { card: newLeftCard, position: farLeftCardPosition - 1 };

                setDisplayArray(currentArray => {
                    const array = [...currentArray];
                    return [newLeftObject, ...array]
                });
                break;
            case 'right':
                generateDirection.current = 'right'

                const farRightCard = displayArray[displayArray.length - 1];
                const farRightCardId = farRightCard.card.id;
                const farRightCardPosition = farRightCard.position;

                /* If farRightCardId is the maximum, e.g. 4 when the array has 5 objects, adding 1 and making it 5 wouldn't be a valid index and we 
                   would have to create a handler for it. But with the wrap() in getIndex, maximum + 1 will become the minimum value as intended. */
                const indexRight = getIndex(farRightCardId + 1);
                let newRightCard = projectArray[indexRight];
                const newRightObject: displayObject = { card: newRightCard, position: farRightCardPosition + 1 };
                setDisplayArray(currentArray => {
                    const array = [...currentArray];
                    return [...array, newRightObject]
                });
                break;
        }
    }

    useMotionValueEvent(x, "change", (currentX) => {
        const distanceMoved = currentX - startX.current
        switch (generateDirection.current) {
            case 'none':
                /* More than 0 means the carousel has moved to the right, so a new div will need to occupy the newly empty left side.
                   Less than 0 means the carousel has moved to the left, so a new div will need to occupy the newly empty right side. */
                if (distanceMoved > 0) {
                    generateCard('left');
                } else if (distanceMoved < 0) {
                    generateCard('right');
                }
                break;
            case 'left':
                /* When generateDirection is left, distanceMoved should always be more than 0. If it's less than or equal to 0, it
                   means that it has gone the opposite direction or it's neutral position. We should then remove the previously
                   generated left div as it's no longer in view. */
                if (distanceMoved <= 0) {
                    const currentArray = [...displayArray];
                    currentArray.shift();
                    setDisplayArray(currentArray);
                    generateDirection.current = 'none';
                }

                /* useMotionValue won't always capture every frame, rather than 1 to 0 to -1, it might jump from 1 to -1, leaving
                   no time for generateDirection to become 'none' to then trigger generateCard('right'). Thus we'll have to trigger
                   it ourself. */
                if (distanceMoved < 0) {
                    generateCard('right');
                }

                // Triggers when the next card has fully taken up the active space, usually via snapToClosest, or if you scroll past the active card to see the next
                if (Math.abs(distanceMoved) >= cardWidth.current) {
                    // The previous card should be off-screen by now, so we remove it
                    const array = [...displayArray];
                    array.pop();
                    setDisplayArray(array);

                    /* Update startX so distanceMoved will only ever be equal to or more than cardWidth once. Otherwise, in the scenario where cardWidth is 200px, and
                       distanceMoved is 200px, if we don't reset, after moving 1px to the right it'll be 201px which still fulfills the condition of being more than or
                       equal to 200, causing the array to be shifted/popped again, and this will keep repeating for every movement. */
                    startX.current += cardWidth.current;

                    // Only when the distance is more than the card width meaning the next card will be seen, do we generate the card
                    if (Math.abs(distanceMoved) > cardWidth.current) {
                        generateCard('left');
                    } else {
                        // Otherwise, if we stop at exactly the length of cardWidth, we can set the direction to none as we're in a neutral state
                        generateDirection.current = 'none';
                    }
                }

                break;
            case 'right':
                /* When generateDirection is right, distanceMoved should always be less than 0. If it's more than or equal to 0, it
                   means that it has gone the opposite direction or it's neutral position. We should then remove the previously
                   generated right div as it's no longer in view. */
                if (distanceMoved >= 0) {
                    const currentArray = [...displayArray];
                    currentArray.pop();
                    setDisplayArray(currentArray);
                    generateDirection.current = 'none';
                }

                /* useMotionValue won't always capture every frame, rather than -1 to 0 to 1, it might jump from -1 to 1, leaving
                   no time for generateDirection to become 'none' to then trigger generateCard('left'). Thus we'll have to trigger
                   it ourself. */
                if (distanceMoved > 0) {
                    generateCard('left');
                }

                // Triggers when the next card has fully taken up the active space, usually via snapToClosest, or if you scroll past the active card to see the next
                if (Math.abs(distanceMoved) >= cardWidth.current) {
                    // The previous card should be off-screen by now, so we remove it
                    const array = [...displayArray];
                    array.shift();
                    setDisplayArray(array);

                    /* Update startX so distanceMoved will only ever be equal to or more than cardWidth once. Otherwise, in the scenario where cardWidth is 200px, and
                       distanceMoved is 200px, if we don't reset, after moving 1px to the right it'll be 201px which still fulfills the condition of being more than or
                       equal to 200, causing the array to be shifted/popped again, and this will keep repeating for every movement. */
                    startX.current -= cardWidth.current;

                    // Only when the distance is more than the card width meaning the next card will be seen, do we generate the card
                    if (Math.abs(distanceMoved) > cardWidth.current) {
                        generateCard('right');
                    } else {
                        // Otherwise, if we stop at exactly the length of cardWidth, we can set the direction to none as we're in a neutral state
                        generateDirection.current = 'none';
                    }
                }
                break;
        }

        // Based on currentX, set the active card, like when more than half of the current active card has passed

        /* Explanation for the following active functions: 
        
           Picture this, there are 5 divs, E1, E2, E3, E4, E5. E3 is the current active as it is the center. Each of them are 200px wide, and there's an active area
           in the center that's also 200px wide, which will determine which div is active. To make the next card active, more than 50% of the new card must take up 
           the active area, which means total distance travelled needs to be more than 100px so that more than half of the current active will be off-screen.
           Therefore the initial thresholds should be -100px and 100px. 
           
           If currentX increases past 100px, it means it's being dragged to the right, which actually means we're exposing more of the left side. If we look at the
           5 E's example, the left side of E3 is E2 and E1, so out activeCardId should -1 everytime we hit the threshold. Let's say our currentX is 101px, we've
           made E2 the new active. Our thresholds now can't be 100px and -100px as 101px is outside of it, instead we should factor in that we made it past one
           card and increase it by it's width, 200px. So the new thresholds will be 300px and 100px. If we move -2px we'll drop below 100px and make E3 the new
           active again, but if we want to make E1 the active, we need to drag it past 300px.
           
           This explains the threshold formula, number of cards passed * card width +/- half of the card width. If we relook at the beginning, 0*200-100 & 0*200+100
           is -100px and 100px respectively. And when one card has passed, 1*200-100 & 1*200+100 is 100px and 300px respectively. This formula will work endlessly
           even as the number of cards passed becomes negative, -1*200-100 & -1*200+100 is -300px and -100px respectively.
           
           And to reset to the initial scenario to explain the inverse, E3 is the active, thresholds are -100px and 100px. When currentX decreases to below -100px,
           it means it's being dragged to the left, which means we're exposing more of the right side. The right side of E3 is E4 and E5. So as out currentX
           becomes more negative, our activeCardId should increase. To reflect us going in the negatives, we need to make our threshold even more negative. Let's
           say our currentX is now -101px and E4 is our active. The previous threshold of -100px to 100px no longer works as we're out of it. As described earlier,
           -1*200-100 & -1*200+100 is -300px and -100px respectively, which is what we want. Increasing currentX be 2px to make -101px more than -100px will go back
           to making E3 active. As such, activeCardsPassed needs to be minused to reflect the negatively transformed currentX, even if our activeCardId is increasing. */
        const translateDecreaseThreshold = activeCardsPassed.current * cardWidth.current - cardWidth.current / 2;
        const translateIncreaseThreshold = activeCardsPassed.current * cardWidth.current + cardWidth.current / 2;

        if (currentX > translateIncreaseThreshold) {
            activeCardsPassed.current++;
            setActiveCardId(currentId => getIndex(currentId - 1));
        } else if (currentX < translateDecreaseThreshold) {
            activeCardsPassed.current--;
            setActiveCardId(currentId => getIndex(currentId + 1));
        }

    });

    const midSnap = useRef<boolean>(false);
    // When carousel comes to a stop
    useMotionValueEvent(x, 'animationComplete', () => {
        snapToClosest();
    })

    // Controls how many cards are shown at a time in the carousel
    const cardDisplayNumber = useRef<number>(1);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const carouselWidth = useRef<number>(0);
    const cardWidth = useRef<number>(0);

    // Controls active card
    const [activeCardId, setActiveCardId] = useState<number>(0);
    const activeCardsPassed = useRef<number>(0);

    // Controls display of info text instruction, should only show once and hide after user has switched active cards once, showing understanding of how it works
    const [showInfo, setShowInfo] = useState<boolean>(true);

    useEffect(() => {
        if (!carouselRef.current) throw new Error('Carousel ref not detected at useEffect projects');

        controller.stop();
        controller.set({ x: 0 });
        carouselWidth.current = carouselRef.current.getBoundingClientRect().width;

        if (carouselWidth.current <= 700) {
            cardDisplayNumber.current = 1;
            setNotMinimized(false);
        } else if (carouselWidth.current <= 1300) {
            cardDisplayNumber.current = 3;
        } else {
            cardDisplayNumber.current = 5;
        }

        cardWidth.current = carouselWidth.current / cardDisplayNumber.current;

        // Populate the displayArray with the project cards
        for (let i = 0; i < cardDisplayNumber.current; i++) {
            /* If cardDisplayNumber is 5 but we only have 2 project cards in projectArray, when we try to get
               the third card, wrap will return the first card to create a seamless loop. */
            const index = getIndex(i);
            setDisplayArray(currentArray => [...currentArray, { card: projectArray[index], position: i }]);

            // Initialise Active Card, setting the center of the displayArray as the active by default
            if (i === Math.floor(cardDisplayNumber.current / 2)) {
                setActiveCardId(projectArray[index].id);
            }
        }


        const parentSection = mainVideoRef.current?.closest('section');
        const observer = new MutationObserver(() => {
            if (parentSection) {
                if (parentSection.classList.contains('active')) {
                    playVideos();
                } else {
                    pauseVideos();
                }
            }
        });

        if (parentSection) {
            observer.observe(parentSection, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                pauseVideos();
            } else if (document.visibilityState === 'visible') {
                // Ensures the video isn't played when clicking back to the website while it's on other sections
                if (carouselRef.current) {
                    const parentSection = carouselRef.current.closest('section');
                    if (parentSection && parentSection.classList.contains('active')) {
                        playVideos();
                    }
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Clear displayArray on dismount to prevent multiple triggers from generating more than intended
            setDisplayArray([]);

            observer.disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Triggers whenever carousel moves to the next card
    useEffect(() => {
        // Hides info hint once user moves to another card, showing they know how the carousel works
        if (activeCardsPassed.current !== 0) {
            setShowInfo(false);
        }

        // If infoWindow was expanded on minimized layout, hide it when moving to the next active
        if (showMore) {
            setShowMore(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCardsPassed.current])

    /* 
       The purpose of the useRef dragged, handleOnDragEnd(), and handleOnPointerUp(), is to trigger snapToClosest() conditionally.

       Scenario 1, we drag and flick the carousel, both handlers will trigger, but we don't want to snapToClosest() here as we want
       the carousel to keep spinning from the inertia of the flick. Thus we have handleOnDragEnd() set the dragged useRef to true so
       handleOnPointerUp() will skip the snapToClosest() trigger.
       
       Scenario 2, while it's spinning we hold down our mouse/touch to stop the carousel from spinning. When we release the hold, we
       want to trigger snapToClosest() now that it has stopped. In this scenario, handleOnDragEnd() won't trigger as we're stopping
       the movement with a static hold/click and there's no movement. Thus, dragged will remain false and snapToClosest() will
       trigger as intended. 
    */
    const dragged = useRef<boolean>(false);

    const handleOnDragEnd = () => {
        dragged.current = true;
        /* We need to set it back to false so scenario 2 will work, otherwise it'll just keep skipping snapToClosest().
           But we can't put the set to false in onPointerUp as you can drag the carousel but if your final pointer
           position is outside of the carousel, dragged.current will remain true. As such we set it to expire
           right after handleOnPointerUp() would check for it, whether it happens or not. */
        setTimeout(() => dragged.current = false, 101);
    }

    const handleOnPointerUp = () => {
        /* We need this setTimeout as by default the onPointerUp handler will trigger before the onDragEnd handler triggers.
           But for our use case, we need onDragEnd to happen first to know whether to trigger snapToClosest(). */
        setTimeout(() => {
            if (dragged.current) return;
            snapToClosest();
        }, 100);
    }

    const [notMinimized, setNotMinimized] = useState<boolean>(true);
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <>
            <div className='projectMainDisplay'>
                <div className='spacer-top'></div>
                <div className='videoDisplay'>
                    <video ref={mainVideoRef} src={projectArray[activeCardId].video.url} className='mainPlayer' muted loop onCanPlay={playVideos} onPause={pauseBgVideo} onPlay={playBgVideo}></video>
                </div>
                <div className='spacer-middle'></div>
                {!notMinimized && (<div className='minimizedSection'>
                    <h1>{projectArray[activeCardId].title}</h1>
                    {(projectArray[activeCardId].video.hasAudio && !notMinimized) && (<p>This video has audio: <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={toggleMuteVideo}>Click to toggle the audio</span></p>)}
                    <button className='minimizedButton' onClick={() => setShowMore(true)}>See Description</button>
                </div>)}
                <div className='spacer-bottom'></div>
                {(notMinimized || showMore) && (<div className='infoWindow'>
                    <h1>{projectArray[activeCardId].title}</h1>
                    <IgnoreScroll>
                        <p style={{ whiteSpace: 'pre-line' }}>{projectArray[activeCardId].description}</p>
                    </IgnoreScroll>
                    {(projectArray[activeCardId].video.hasAudio && notMinimized) && (<p>This video has audio: <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={toggleMuteVideo}>Click to toggle the audio</span></p>)}
                    {showMore && (<p style={{ textDecoration: 'underline' }} onClick={() => setShowMore(false)}>Click to close description</p>)}
                </div>)}
                <video ref={bgVideoRef} src={projectArray[activeCardId].video.url} className='bgPlayer' muted loop></video>
            </div>
            <div className='carouselCover'>
                <div className='inactiveCover'></div>
                <div className='activeCover' style={{ width: `${cardWidth.current}px` }}>
                    {showInfo && (<p className='carouselInfoText'>Drag the banner left or right to see more!</p>)}
                </div>
                <div className='inactiveCover'></div>
            </div>
            <motion.div ref={carouselRef} className='carousel' style={{ x, pointerEvents: 'all' }} drag='x' animate={controller} onDragEnd={handleOnDragEnd} onPointerUp={handleOnPointerUp}>
                {
                    displayArray.map((project) => (
                        <div key={project.position} className='projectCard ignoreScroll' id={`${project.position}`} style={{ backgroundImage: project.card.bannerImageUrl, transform: `translateX(${100 * project.position}%)`, width: `${cardWidth.current}px` }}>
                            <p className='projectTitle'>{project.card.title}</p>
                        </div>
                    ))
                }
            </motion.div>
        </>
    )
}