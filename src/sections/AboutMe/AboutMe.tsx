import { useState } from 'react';
import AboutMeCard from '../../components/AboutMeCard/AboutMeCard';
import FloatingLights from '../../components/FloatingLights/FloatingLights';
import { aboutMeArray } from './AboutMeCardData';

export default function AboutMe() {

    /* { length: n } defines the size of the new array, and in turn how many times to iterate the function in the second argument.
       The function in the second argument, (_, i) => aboutMeArray.length - 1, fills the array up to 5 times due to the length.
       The _ is a placeholder, in this case signifying we don't need it. Normally if you have an array like, 
       const source = ['one', 'two', 'three', 'four', 'five'], then you do: Array.from(source, (value, i) => `${i}: ${value}`), the array
       will return ['1: one', '2: two', '3: three', '4: four', '5: five']. 
       
       For our case, we're trying to make a descending array of numbers. For example, if aboutMeArray.length is 3, our new array will be
       [3, 2, 1], if it's 5 then it'll be [5, 4, 3, 2, 1] due to the function, (_, i)=>aboutMeArray.length-i). */
    const zIndexArray = Array.from({length: aboutMeArray.length}, (_, i)=>aboutMeArray.length-i);

    // This useState is being referenced by the AboutMeCard's to determine their z-index
    const [zIndexes, setZIndexes] = useState<number[]>(zIndexArray);

    /* This function updates the above useState to change the order of the AboutMeCard's. This function is triggered by one of the AboutMeCard
       when it's trying to move to the back. By updating the useState here, one AboutMeCard can indirectly affect the z-index of other
       AboutMeCard's. 
       
       Let's say the current zIndexes array is [3, 2, 1], which means the first AboutMeCard's z-index is 3, second is 2, third is 1. When the
       first AboutMeCard is triggering this to move to the back, we manipulate the array to be come (1, 3, 2), so now the first AboutMeCard is
       1, second is 3, third is 2. Which means now the second AboutMeCard is in the front. When we repeat this again such that the zIndexes
       array is now [2, 1, 3], now the 3rd AboutMeCard is at the front. */
    const updateZIndexes = (currentIndex: number) => {
        if (zIndexes[currentIndex] === Math.max(...zIndexes)) {
            const newArray = [...zIndexes];
            const poppedNumber = newArray.pop();

            if (poppedNumber) {
                newArray.unshift(poppedNumber);
                setZIndexes(newArray);
            }
        }
    }

    return (
        <>
            <FloatingLights />
            {aboutMeArray.map((card, index) => {

                // Used to determine the next card's title
                let nextCard;

                // If the current card's index is 2, and the array only has 3 objects, 2+1 will loop back to 0
                if (index + 1 >= aboutMeArray.length) {
                    nextCard = aboutMeArray[0];
                } else {
                    nextCard = aboutMeArray[index + 1];
                }
                
                return <AboutMeCard title={card.title} nextTitle={nextCard.title} bodyText={card.bodyText} zIndexObject={{ index: index, array: zIndexes, zIndex: zIndexes[index] }} imagePropsUrl={card.imagePropsUrl} updateZIndex={(currentIndex: number) => { updateZIndexes(currentIndex) }} />
            })}
        </>
    )
}