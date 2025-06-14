import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import NavBar from '../../components/NavBar/NavBar';

export default function Home() {

    // Object to contain the refs to all sections so handleNavigate can search for the right ref with a key
    const navRefs = {
        home: useRef<HTMLElement | null>(null),
        about: useRef<HTMLElement | null>(null),
        projects: useRef<HTMLElement | null>(null),
    }

    const navKeys: string[] = Object.keys(navRefs);

    const currentSection = useRef<number>(0);

    // Receives the id of which nav element has been clicked to scroll to the right section
    const handleNavigate = (sectionId: keyof typeof navRefs) => {
        const section = navRefs[sectionId];
        if (section.current) {
            section.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /* == Message Related Declarations == */

    // List of potential messages to show based on time of day
    const timebasedMessages = {
        '24-5': ["If you're working the night shift, o7. Thank you for your hard work, hope the rest of the shift goes well!", "Trouble sleeping? Grab a glass of water and have a seat, wanna talk about it?", "*snore* Wha-what? What's up? You really woke me up because you're scared? *sigh* I'm going back to bed...", "Wth?! You're still awake?! Who cares if you're partying or gaming, have you looked at the time?! And you wonder why you have a headache the next morning, geez."],
        '5-7': ["You're up early. Have a great rest of your day!", "Wow your day's starting already? All the best!", "*yawn* It's still so early...just...5 more minutes...", "Don't tell me you're only going to bed now... What is your sleep schedule?"],
        '7-11': ["Rise and shine sleepyhead, you've got your whole day ahead of you!", "Good Morning! Have a wonderful day ahead!", "*stretches* Gosh my sleep was horrible, gotta stop gaming so late.", "YOU'RE LATE! QUICK WAKE UP! GO GO GO! FORGET ABOUT SHOWERING, THE CROWD IN THE TRAIN WILL STINK YOU UP ANYWAYS!"],
        '11-13': ["Good Afternoon! Great work so far, enjoy your well deserved lunch break!", "Whew, finally some time to unwind am I right. You're half way there, keep it up!", "*stomach grumbling* Gosh, I'm so hungry! Oh, what do you have there? It looks kind of good, mind if I...", "What?! You only just woke up? You either have my respect for working the night shift or you gotta get your act together!"],
        '13-16': ["You're almost at the finish line, you got this!", "Hey...what are you doing looking at this... Focus on your task, just a few more hours.", "*grumbles* How is it not time yet? I'm soooooo ready to leaveeeee!", "Look at you lazing around while everyone else is working...tsk tsk tsk. Must be nice being a freeloader at home everyday."],
        '16-21': ["You did it! You made it! Finally time to take a nice shower and relax for the rest of the day!", "Good Evening! How was your day? Hope it went well! Enjoy your well deserved rest.", "*squeeze* I'm already so exhausted why do I still have to deal with crowded public transport. Curse my brokeness!", "Damn, coming back to an empty house huh... It's not much, but, here's a virtual hug. You've worked hard today."],
        '21-24': ["Good Night! Rest well, you got a long day ahead tomorrow!", "Wow, it's so late already. Better get your much needed sleep you hear, gotta take good care of your body.", "*yawn* Just one more round then I'll go to bed, I promise...", "The night is still early you say? You better get your butt in bed, don't make me say it twice. Youngsters these days, I swear..."]
    }

    // List the odds of each corresponding message in timebasedMessages to appear, number represents percentage out of 100, array should add up to 100
    const messageOdds: number[] = [43, 43, 10, 4];

    // Fill an array x number of times equal to the number in messageOdds to simulate a way to randomize the messages where each have different odds
    const messageGacha: number[] = [];
    const [selectedMessage, setSelectedMessage] = useState<string>('Welcome to my website!');
    for (let i = 0; i < messageOdds.length; i++) {
        for (let j = 0; j < messageOdds[i]; j++) {
            messageGacha.push(i);
        }
    }

    // Used to prevent repeat messages from showing in hero message box
    const currentIndice = useRef<number | null>(null);

    /* == Typing Related Declarations == */

    // Used to know which character it's currently at to type out that letter
    const charIndex = useRef<number>(0);

    // Used to avoid triggering typeAnimation for a new message when it's currently typing something
    const isTyping = useRef<boolean>(false);

    /* == Handle Message Click Related Declarations == */

    // Used to know if the typing animation needs to be aborted
    const abortTyping = useRef<boolean>(false);

    const getHeroMessage = () => {

        // Get current hour to determine which array of messages from timebasedMessages to choose from
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        let key: keyof typeof timebasedMessages = '24-5';

        // Based on the time, retrieve the appropriate set of messages by setting the right key
        if (currentHour >= 0 && currentHour < 5) {
            key = '24-5';
        } else if (currentHour >= 5 && currentHour < 7) {
            key = '5-7'
        } else if (currentHour >= 7 && currentHour < 11) {
            key = '7-11'
        } else if (currentHour >= 11 && currentHour < 13) {
            key = '11-13'
        } else if (currentHour >= 13 && currentHour < 16) {
            key = '13-16'
        } else if (currentHour >= 16 && currentHour < 21) {
            key = '16-21'
        } else if (currentHour >= 21 && currentHour < 24) {
            key = '21-24'
        }

        let indiceArray = messageGacha;

        // New array to filter out the current showing message if any to avoid repeats, need to specify null as 0 is considered falsy and will skip this
        if (currentIndice.current !== null) {
            indiceArray = messageGacha.filter(indice => indice !== currentIndice.current);
        }

        /* Math.random gets a random decimal from 0 to 1, multiplying by messageGacha.length makes it a random decimal from 0 to 100
           to simulate percentage odds. Math.floor rounds it down to the nearest integer */
        const randomIndice = Math.floor(Math.random() * indiceArray.length)

        // Based on the random integer from 0 to 100, pick from messageGacha that has varying amounts of numbers from 0 to 3 based on messageOdds
        const selectedIndice = indiceArray[randomIndice]

        // Ensures no messages are currently in the midst of typing when this is triggered
        if (!isTyping.current) {

            // Based on the selected number from 0 to 3, retrieve the corresponding message and start typing animation
            typeAnimation(timebasedMessages[key][selectedIndice]);

        }

        // Updates currentIndice to avoid repeats
        currentIndice.current = selectedIndice;

    }


    const typeAnimation = (message: string) => {

        const currentCharIndex = charIndex.current;

        // Checks if user wants to abort typing aniamtion, only proceed if not
        if (!abortTyping.current) {

            // If it's the start of the message, clear any previous messages and lets app knows that typing is going to start
            if (charIndex.current === 0) {
                setSelectedMessage('');
                isTyping.current = true;
            }

            if (currentCharIndex < message.length) {

                // Checks the current character, adds more of a pause if for a full stop, comma, question mark, or exclamation mark to make it look nicer
                const currentCharacter = message.charAt(currentCharIndex);
                const timeout = '.,?!'.includes(currentCharacter) ? 700 : 30;

                // Adds character to the current message to simulate typing
                setSelectedMessage(currentMsg => currentMsg + currentCharacter);

                // Update char index to let the next trigger know to move to the next character in the message
                charIndex.current++;

                // Calls this function after a certain timeout to simulate typing animation
                setTimeout(() => typeAnimation(message), timeout);

            } else {

                // Reset state to let app know a new message can be triggered to type
                charIndex.current = 0;
                isTyping.current = false;

            }

        } else {

            // Add all of the remaining message to end the typing
            setSelectedMessage(currentMsg => currentMsg + message.substring(currentCharIndex));

            // Reset state to let app know a new message can be triggered to type
            charIndex.current = 0;
            isTyping.current = false;

            // Reset abortTyping so the next messages will type normally
            abortTyping.current = false;

        }

    }

    const handleMessageClick = () => {

        if (isTyping.current) {

            // If there's a typeAnimation nested loop currently going on, let them know via the abortTyping ref to stop and finish the rest
            abortTyping.current = true;

        } else {

            // If all messages are already typed, the click that means user wants a new message
            getHeroMessage();

        }
    }

    /* == Scroll Replacement Related Declarations == */

    const pauseScroll = useRef<boolean>(false);

    // Temporarily stops any scroll behaviour while a menu like 'Sign In' is active
    const handleScroll = (pause: boolean) => {
        pauseScroll.current = pause ? true : false;
    }

    // Gets the time where the event listener was last triggered
    const lastUpdate = useRef(0);

    // Sets minimum delay before function in event listener can be triggered again
    const scrollDelay = 400;

    // When scrolling on desktop
    window.addEventListener('wheel', (event) => {

        if (pauseScroll.current) return;

        const now = Date.now();

        /* Gets the time difference of the current time from the last time this fn was triggered, then only 
           trigger this function if the set delay timing has passed */
        if (now - lastUpdate.current > scrollDelay) {
            // deltaY more than 0 means scrolling down, less than 0 means scrolling up

            /* If we're scrolling up, make sure that if we were to add 1 it wouldn't exceed the length and point to a section that doesn't exist. 
               Else if we're scrolling down, after we minus 1, it wouldn't be less than 0 and be a negative section, which won't exist. */
            if (event.deltaY > 0 && currentSection.current + 1 < navKeys.length) {
                currentSection.current++;
            } else if (event.deltaY < 0 && currentSection.current - 1 >= 0) {
                currentSection.current--;
            }

            // Regardless scrolling up or down, trigger navigate and update the timer
            const currentSectionName = navKeys[currentSection.current] as keyof typeof navRefs;
            handleNavigate(currentSectionName);
            lastUpdate.current = now;

        }
    });

    // Know the starting touch point to determine the direction swiped
    const touchPoint = useRef(0)

    // When scrolling on mobile

    // Gets y axis of initial touch point to use as reference when there's a swipe
    window.addEventListener("touchstart", (event) => {
        if (pauseScroll.current) return;
        touchPoint.current = event.touches[0].clientY;
    });

    // When there's a swipe on mobile, get the ending point, based on it and the initial touch we can determine whether the direction of the swipe
    window.addEventListener("touchmove", (event) => {

        if (pauseScroll.current) return;

        const now = Date.now();

        // Avoids multiple triggers to update touchPoint
        if (now - lastUpdate.current > scrollDelay) {
            let swipeEndPoint = event.touches[0].clientY;

            /* If swipeEndPoint is lower than touchPoint, it means the user swiped up, which in mobile orientation means the user is trying to
               scroll down, so we follow the same logic as with the scroll listener. Conversely, if swipeEndPoint is higher than touchPoint, it
               means the user swiped down to a lower point, which means they were trying to scroll up */
            if (swipeEndPoint < touchPoint.current && currentSection.current + 1 < navKeys.length) {
                currentSection.current++;
            } else if (swipeEndPoint > touchPoint.current && currentSection.current - 1 >= 0) {
                currentSection.current--;
            }

            // Regardless scrolling up or down, trigger navigate and update the timer
            const currentSectionName = navKeys[currentSection.current] as keyof typeof navRefs;
            handleNavigate(currentSectionName);
            lastUpdate.current = now;
        }
    });

    useEffect(() => {

        // Initiate display messages
        getHeroMessage();

        // Ensures every refresh to sync the displayed section with the currentSection ref
            const currentSectionName = navKeys[currentSection.current] as keyof typeof navRefs;
            handleNavigate(currentSectionName);

        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <NavBar navigateRequest={(sectionId: keyof typeof navRefs) => { handleNavigate(sectionId) }} pauseScroll={(pause) => { handleScroll(pause) }} />
            <div className='section-scroll'>
                <section className='hero-welcome-screen' ref={navRefs.home}>
                    <div className='hero-message-box' onClick={handleMessageClick}>
                        <div className='hero-name-box'>
                            <p className='hero-name-text'>Jun Hua</p>
                        </div>
                        <div className='hero-next-blinker'></div>
                        <p className='hero-message'>{selectedMessage}</p>
                    </div>
                    <img className='hero-image' src='/img/transparent_profile.png' alt='Profile Shot of Jun Hua' />
                </section>
                <section className='about-me' id='about-me' ref={navRefs.about}></section>
                <section className='my-projects' id='my-projects' ref={navRefs.projects}></section>
            </div>
        </div>
    )
}
