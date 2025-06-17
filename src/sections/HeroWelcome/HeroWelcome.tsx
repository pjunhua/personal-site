import { useEffect, useState, useRef } from 'react';
import { useLogIn } from '../../context/LogInContext';
import './HeroWelcome.css';

export default function HeroWelcome() {

    // LogInContext to determine if user is logged in or not
    const { loggedIn } = useLogIn();

    // Used when displaying messages at home screen, if not logged in and first time viewing message, show default, otherwise show time based messages
    const firstMessage = useRef<boolean>(true);

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
    const [selectedMessage, setSelectedMessage] = useState<string>('');
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

        // If not logged in and first time seeing message, show default
        if (!loggedIn.current && firstMessage.current) {

            // Ensures no messages are currently in the midst of typing when this is triggered
            if (!isTyping.current) {
                typeAnimation(
                    "Welcome to my website, I'm Jun Hua! Scroll to learn more about me, or click on this box for some small talk!"
                );
            }

            // Set first message to false so when user clicks to display next message, it'll be a time based one instead of this one again
            firstMessage.current = false;

        } else {

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

    // useRef to determine whether the relevant message box doms will gain the class to start the animation
    const [startMsgBoxAnimation, setStartMsgBoxAnimation] = useState<boolean>(false);

    /* == About Me Related Declarations == */

    useEffect(() => {

        // Initiate animation of message box opening
        setStartMsgBoxAnimation(true);

        // Initiate display messages
        firstMessage.current = true;
        setTimeout(() => getHeroMessage(), 1200);

        // Always starts at top on refresh, restoring to previous position messes with currentSection ref as it won't be synced
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }

        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className={`hero-message-box ${startMsgBoxAnimation ? 'open-hero-message-box' : ''}`} onClick={handleMessageClick}>
                <div className={`hero-name-box ${startMsgBoxAnimation ? 'open-hero-name-box' : ''}`}>
                    <p className='hero-name-text'>Jun Hua</p>
                </div>
                <div className={`hero-next-blinker ${startMsgBoxAnimation ? 'open-hero-next-blinker' : ''}`}></div>
                <p className='hero-message'>{selectedMessage}</p>
            </div>
            <img className='hero-image' src='/img/transparent_profile.png' alt='Profile Shot of Jun Hua' />
        </>
    )
}