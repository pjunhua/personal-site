import React, { useEffect, useRef } from 'react';
import './ResTextHori.css'

/* ResTextHori, short for Responsive Text Horizontal. The purpose of this is to dynamically resize a text such that it's width is 
   always within the container as it resizes, while also allowing for better control of the font size. */

// Ensures the text and widthPercent passed is a string value and a string that includes only a number with a % at the end respectively
interface TextProps {
    text: string;
    widthPercent: `${number}%`;
    position: 'Top' | 'Bottom' | 'Left' | 'Right';
    onCalculate: (newFontSize: number) => void;
    fontSize: number;
}

// Exported function expects a text and widthPercent to be passed that matches the TextProps ruling
export default function ResTextHori({ text, widthPercent, position, onCalculate, fontSize }: TextProps) {

    const h1Ref = useRef<HTMLHeadingElement | null>(null);
    const divRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {

        const adjustFontSize = () => {
            if (h1Ref.current && divRef.current) {
                const { width, height } = h1Ref.current.getBoundingClientRect();
                const aspectRatio = width / height; //Aspect ratio needs working on, sometimes on launch it'll use a different aaspect ratio. Maybe it's due to the previous h1 that's retrieved via getBoundingClientRect() or how the initial h1 is rendered
                const parentDivStyle = window.getComputedStyle(divRef.current);
                const verticalPadding = parseFloat(parentDivStyle.paddingLeft) + parseFloat(parentDivStyle.paddingRight);
                const verticalLeeway = 100;
                console.log(`${(window.innerWidth / 2 - verticalPadding - verticalLeeway) / aspectRatio} ${aspectRatio} ${window.innerWidth}`);
                onCalculate((window.innerWidth / 2 - verticalPadding - verticalLeeway) / aspectRatio);
            }
        }

        adjustFontSize();

        const observer = new ResizeObserver(() => {
            adjustFontSize();
        });

        if (h1Ref.current && divRef.current) {
            observer.observe(divRef.current);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={divRef} className='textbox' style={{ width: widthPercent, [`padding${position}`]: 70 }}>
            <h1 ref={h1Ref} style={{ fontSize }}>{text}</h1>
        </div>
    );
}

/* Add the following code to the page with this App in the event there's multiple to ensure font size is consistent rather than one looking
   larger than the other. */

// const [fontSize, setFontSize] = useState<number>(1000);
// const welcomeRef = useRef<HTMLDivElement | null>(null);
// const readyToDisplay = useRef<boolean>(false);
// let fontSizesToCompare: number[] = [];

// const settleFontSize = (newFontSize: number): void => {
//     console.log(newFontSize);
//     if (welcomeRef.current) {
//         const expectedCount = welcomeRef.current.children.length;
//         fontSizesToCompare.push(newFontSize);
//         if (fontSizesToCompare.length === expectedCount) {
//             setFontSize(Math.min(...fontSizesToCompare));
//             fontSizesToCompare.length = 0;
//             readyToDisplay.current = true;
//         } else {
//             readyToDisplay.current = false;
//         }
//     }
// }

/* Example of how this component is used */
// <ResTextHori text='JUN' widthPercent='50%' position='Left' onCalculate={(newFontSize) => { settleFontSize(newFontSize) }} fontSize={fontSize} />