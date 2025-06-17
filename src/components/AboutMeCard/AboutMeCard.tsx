import { useState, useRef } from 'react';
import './AboutMeCard.css';

interface AboutMeCardProps {
    title: string;
    nextTitle: string;
    bodyText: string;
    zIndexObject: { index: number, array: number[], zIndex: number };
    imagePropsUrl: { topLeft: string, topRight: string, bottomLeft: string, bottomRight: string };
    updateZIndex: (currentIndex: number) => void;
}

export default function AboutMeCard({ title, nextTitle, bodyText, zIndexObject, imagePropsUrl, updateZIndex }: AboutMeCardProps) {

    // URLs for Images
    const topLeftUrl = useRef<string>(imagePropsUrl.topLeft);
    const topRightUrl = useRef<string>(imagePropsUrl.topRight);
    const bottomLeftUrl = useRef<string>(imagePropsUrl.bottomLeft);
    const bottomRightUrl = useRef<string>(imagePropsUrl.bottomRight);

    const [startAni, setStartAni] = useState<boolean>(false);

    const transitionNext = () => {
        setStartAni(true);
        setTimeout(() => { updateZIndex(zIndexObject.index); setStartAni(false) }, 200);
    }

    return (
        <div className='canvas'>
            <div className='aboutMeImages'>
                {topLeftUrl.current !== '' && (<img className={`tlImage ${zIndexObject.zIndex === Math.max(...zIndexObject.array) ? 'tlImageActive' : ''}`} src={topLeftUrl.current} alt='Top Left' />)}
                {topRightUrl.current !== '' && (<img className={`trImage ${zIndexObject.zIndex === Math.max(...zIndexObject.array) ? 'trImageActive' : ''}`} src={topRightUrl.current} alt='Top Right' />)}
                {bottomLeftUrl.current !== '' && (<img className={`blImage ${zIndexObject.zIndex === Math.max(...zIndexObject.array) ? 'blImageActive' : ''}`} src={bottomLeftUrl.current} alt='Bottom Left' />)}
                {bottomRightUrl.current !== '' && (<img className={`brImage ${zIndexObject.zIndex === Math.max(...zIndexObject.array) ? 'brImageActive' : ''}`} src={bottomRightUrl.current} alt='Bottom Right' />)}
            </div>
            <div className={`card ${startAni ? 'transitioning' : ''}`} onClick={transitionNext} style={{ zIndex: zIndexObject.zIndex }}>
                <h1 className='cardTitle'>{title}</h1>
                <p className='cardBody'>{bodyText}</p>
                <p className='nextTitle'>Click to view the next section: {nextTitle} →</p>
            </div>
        </div>
    )
}