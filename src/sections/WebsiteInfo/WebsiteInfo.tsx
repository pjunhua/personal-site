import { useRef, useState } from 'react';
import TextInputMovingLabel, { TIMLHandle } from '../../components/TextInputMovingLabel/TextInputMovingLabel';
import './WebsiteInfo.css';
import { infoBubble, infoArray } from './WebsiteInfoData';
import IgnoreScroll from '../../components/IgnoreScroll/IgnoreScroll';
import LinkInP from '../../components/LinkInP/LinkInP';

export default function WebsiteInfo() {

    const inputRef = useRef<TIMLHandle | null>(null);

    // As we'll need to modify what's being displayed based on the text input, we can't directly edit infoArray
    const [displayArray, setDisplayArray] = useState<infoBubble[]>(infoArray);

    const handleInputChange = (input: string) => {
        const keywordArray = input.split(' ');

        const array = [...infoArray];
        const filteredArray = array.filter((infoBubble) => infoBubble.tags.some((tag) => {
            let match = false;

            // If the input is completely blank, we should treat it as there's no keywords to filter, and thus show everything
            if (input.trim() === '') {
                match = true;
            } else {
                for (let i = 0; i < keywordArray.length; i++) {
                    const keyword = keywordArray[i].toLowerCase()
                    /* Checks through each keyword to see if it's a match, but we shouldn't accept empty strings if there's another keyword. 
                       Example: 'Test' should return tags with 'test', 'Test ' should still only return tags with 'test', but without the
                       keyword !== '', it will return all tags. */
                    if (tag.includes(keyword) && keyword !== '') {
                        match = true;
                        break;
                    }
                }
            }
            return match;
        }));
        setDisplayArray(filteredArray);
    }

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        // Stops infoBubble's onClick from closing the expanded bubble
        e.stopPropagation();
        if (!inputRef.current) throw new Error('Input ref not detected at handle tag click');
        inputRef.current.setInput(tag);
    }

    return (
        <div className='websiteInfoContainer'>
            <h1 className='infoExplanationText'>Learn more about this website!</h1>
            <p className='infoExplanationText'>Below are all the features you can find on this website! Slowly browse through them or enter keywords in the search bar to find what you're interested in.</p>
            <div className='searchBar'>
                <TextInputMovingLabel ref={inputRef} type='text' id='tagSearch' autoComplete='none' labelText='Enter your keyword here' liveUpdate={(input) => handleInputChange(input)} />
            </div>
            <IgnoreScroll>
                <div className='infoBubbleContainer'>
                    {
                        displayArray.map((info) => {

                            const InfoBubble = () => {

                                const [showMore, setShowMore] = useState<boolean>(false);

                                return (
                                    <div className={`infoBubble ${showMore ? 'expanded' : ''}`} onClick={() => setShowMore(current => !current)}>
                                        <div className='infoHeaderBox'>
                                            <h1 className='infoTitle'>{info.title}</h1>
                                            <div className={`showMoreArrow ${showMore ? 'expanded' : ''}`}></div>
                                        </div>
                                        <IgnoreScroll>
                                            <LinkInP textPara={info.description} className={`infoDescription ${showMore ? 'expanded' : ''}`} />
                                            {/* <p className={`infoDescription ${showMore ? 'expanded' : ''}`}>{info.description}</p> */}
                                        </IgnoreScroll>
                                        <div className='infoFooterBox'>
                                            <p className='tagText'>Tags: </p>
                                            <div className='tagsContainer'>
                                                {info.tags.map((tag) => (
                                                    <div className='tags' onClick={(e) => handleTagClick(e, tag)}>{tag}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            return <InfoBubble />
                        }
                        )
                    }
                </div>
            </IgnoreScroll>
        </div >
    )
}