import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, wrap, useAnimationControls } from 'framer-motion';
import './MyProjects.css';
import IgnoreScroll from '../../components/IgnoreScroll/IgnoreScroll';

export default function MyProjects() {

    type projectCard = {
        bannerImageUrl: string,
        video: { url: string, hasAudio: boolean },
        title: string,
        description: string,
        id: number
    }

    type displayObject = {
        card: projectCard,
        position: number
    }

    const projectCard1: projectCard = {
        bannerImageUrl: "url('/img/thumbnail_pcard/thumbnail_pcard_psthumb.png')",
        video: { url: '/video/thumbnails.mp4', hasAudio: false },
        title: 'Photoshop: Video Thumbnails',
        description: 'Along with video editing, another part of my content creation hobby is creating thumbnails for videos.\n\nI mainly use Photoshop and I have been creating thumbnails for years as seen in the video. I did not have any related studies in this field so it may not be very good, but there are quite a few thumbnails that I am proud of.\n\nThe progress of my thumbnail creation journey can also be seen in the video, the further back it goes, the changes in quality and style are quite evident.',
        id: 0
    }

    const projectCard2: projectCard = {
        bannerImageUrl: "url('/img/thumbnail_pcard/thumbnail_pcard_custompc.png')",
        video: { url: '/video/neocities.mp4', hasAudio: false },
        title: "My First Website: LBGz's Custom PC Services",
        description: "I made this for one of my first-year modules in Singapore Polytechnic, and it was my first ever website created since I started learning programming. It is by no means good or functional, but, it's nice to look back on it and see how much has changed since I first started.\n\nYou can visit it yourself by going to wryyy.neocities.org as shown in the video.",
        id: 1
    }

    const projectCard3: projectCard = {
        bannerImageUrl: "url('/img/thumbnail_pcard/thumbnail_pcard_edits.png')",
        video: { url: '/video/shorts_compilation.mp4', hasAudio: true },
        title: 'Video Editing: YouTube Shorts',
        description: 'As a hobby, I like to make edits of scenes from an anime, in-game, a livestream clip, or sometimes a combination of them.\n\nThese edits were made with Filmora and they are by no means super professional as I have no education background in this field, but I am satisfied with the results!',
        id: 2
    }

    const projectCard4: projectCard = {
        bannerImageUrl: "url('/img/thumbnail_pcard/thumbnail_pcard_sheets.png')",
        video: { url: '/video/paradestate.mp4', hasAudio: false },
        title: 'Apps Script: Data Transfer Across Sheets',
        description: "This was a solution I made to an actual issue I faced during my Full-Time National Service. It was my first time hearing of Google Apps Script and decided to take the challenge to learn it.\n\nFor my vocation, I had to work with another unit on a daily basis along with my actual unit. To let our unit know of our status everyday like if we were on leave, MC, or working as per usual, we update our parade state Google Sheet every week. Our partner unit needed to know of our daily statuses as well, but, we couldn't directly share the same parade state Google Sheet as it contained confidential information of other unit personnels' statuses that weren't involved in this unit partnership.\n\nAs such, this solution was made. With this, I could retrieve the parade state of specific relevant personnels to show to our partner unit without leaking the parade state of other personnels. And all of this is done automatically, only requiring us to update the main Google Sheet.",
        id: 3
    }

    const projectCard5: projectCard = {
        bannerImageUrl: "url('/img/thumbnail_pcard/thumbnail_pcard_saver.png')",
        video: { url: '/video/timestampsaverpromo.mp4', hasAudio: false },
        title: "Chrome Extension: JunHua's YT Timestamp Saver",
        description: "As a disclaimer, YouTube has since made it so when you return to the same video after having watched it before, it'll resume playing from where you left off. However, you need to be logged into an account, else the video will start from the beginning.\n\nWhen I made this extension it was before this update, and whenever I watched videos that were hours long, I remember having to write down the timestamp of where I stopped so I could continue later.\n\nThat's when I decided to take things into my own hand and challenged myself to make a solution with my programming knowledge. This was my first time learning the 'Chrome for Developers' API to create a Chrome Extension. The actual extension is very simple, with a click of the icon, the video timestamp is extracted and injected it into the URL, but it is with that simple click that made my life back then a lot easier which is one of the reasons why I enjoy programming so much.",
        id: 4
    }

    // Array of all the project cards available, intended to hold any amount, fixed and will never change
    const projectArray = [projectCard1, projectCard2, projectCard3, projectCard4, projectCard5];

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

        return () => {
            // Clear displayArray on dismount to prevent multiple triggers from generating more than intended
            setDisplayArray([]);
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
                    <video src={projectArray[activeCardId].video.url} className='mainPlayer' autoPlay muted playsInline loop></video>
                </div>
                <div className='spacer-middle'></div>
                {!notMinimized && (<div className='minimizedSection'>
                    <h1>{projectArray[activeCardId].title}</h1>
                    <button className='minimizedButton' onClick={() => setShowMore(true)}>See Description</button>
                </div>)}
                <div className='spacer-bottom'></div>
                {(notMinimized || showMore) && (<div className='infoWindow'>
                    <h1>{projectArray[activeCardId].title}</h1>
                    <IgnoreScroll>
                        <p style={{ whiteSpace: 'pre-line' }}>{projectArray[activeCardId].description}</p>
                    </IgnoreScroll>
                    <p style={{ textDecoration: 'underline' }} onClick={() => setShowMore(false)}>Click to close description</p>
                </div>)}
                <video src={projectArray[activeCardId].video.url} className='bgPlayer' autoPlay muted playsInline loop></video>
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