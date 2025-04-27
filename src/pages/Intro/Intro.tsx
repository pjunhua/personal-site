import React, { useEffect, useState, useRef } from 'react';
import "./Intro.css"

/* Typescript declaration such that the function received through the prop onFinish later 
   on has to be a function that accepts no arguments and returns nothing. */
interface IntroProps {
    onFinish: () => void;
}

export default function Intro({ onFinish }: IntroProps) {

    // Dynamically update the terminal text with React's useState
    const [typedText, setTypedText] = useState('');

    // Prevents useEffect() from running while the typing animation is still ongoing to prevent conflicts
    const isTyping = useRef(false);

    // Used to track which message and which character of the message is being typed
    const messageIndex = useRef(0);
    const charIndex = useRef(0);

    // useEffect ensures this JS will only run after the DOM is loaded
    useEffect(() => {

        const displayMessages = [
            "[BOOT] Intializing Jun Hua's Personal Site...",
            "\n[LOAD] Loading competent programming skills...",
            "\n[FAIL] ERROR: No competent programming skills found.",
            "\n[LOAD] Loading kdrama_portrait.png...",
            "\n[LOAD] Loading the rest of the code or whatever...",
            "\n[INFO] Website fully loaded! Welcome to my personal website!"
        ];

        /* Logic to prevent multiple simultaneous triggers, such as when Strict Mode from React 
           triggers useEffect() twice during development to stress test. */
        if (isTyping.current) return;
        isTyping.current = true;

        // The nested function to simulate a typing animation
        const typeAnimation = () => {

            // Logic to ensure all messages in displayMessages have been gone through
            if (messageIndex.current < displayMessages.length) {

                // Reduce the need to type out such a long declaration each time by assigning to a const
                const currentMessage = displayMessages[messageIndex.current]

                // Logic to ensure all characters of the current message have been gone through
                if (charIndex.current < currentMessage.length) {

                    /* This declaration is needed, as without it setTypedText skips the second character. Got the solution from
                       debugging with AI, but their explanation still kind of confuses me. The main issue I understood was that
                       setTypedText isn't instant, but charIndex.current++ is. So when I did currentMessage.charAt(charIndex.current)
                       it caused some kind of desync. But I still don't know why the second character, and I can't visualize the
                       explanation given to me. Also the timeout interval isn't the issue, changed 10 to 50, and even 500, still
                       had the same issue. */
                    const currentCharIndex = charIndex.current;

                    /* Change the state of typedText with the useState hook, causing it to reflect dynamically 
                       through re-renders rather than having to manipulate the DOM each time. */
                    setTypedText(currentText => currentText + currentMessage.charAt(currentCharIndex));

                    // Increase the charIndex to move onto the next character of the message
                    charIndex.current++;

                    /* Calls the function after a small delay to simulate typing delay, the typeAnimation 
                       called will redo this but with the updated charIndex value. */
                    setTimeout(typeAnimation, 10);

                } else {

                    // This else triggers when calling this function after the last character of the message has been typed

                    // Reset the charIndex to 0, so when we move to the next message, it'll start at the first character
                    charIndex.current = 0;

                    // Increase the messageIndex so the function will move to the next message in the displayMessages array
                    messageIndex.current++;

                    // Retrigger the typeAnimation for the new messageIndex and charIndex with a slightly longer pause
                    setTimeout(typeAnimation, 500);
                }
            } else {

                // This else triggers when calling this function after the last message in displayMessages has been typed

                // Cleanup by setting the messageIndex to 0 in case of a repeat call
                messageIndex.current = 0;

                // Cleanup to allow this function to be triggered again by disabling the filter
                isTyping.current = false;

                // Close out Intro.jsx to show Home.jsx after typing animation finishes
                setTimeout(onFinish, 500)

            }
        }

        // Calling the function to start the whole typing animation
        typeAnimation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Blank array [] means it'll only trigger once in production and won't retrigger on every re-render or when a certain state changes

    return (
        <div className="intro-container">
            <div className="terminal">
                {/* whiteSpace pre-line makes it so \n is factored in when typing out the messages. */}
                <h2 className="terminal-text" style={{ whiteSpace: 'pre-line' }}>{typedText}<span className="cursor">|</span></h2>
            </div>
        </div>
    );
}