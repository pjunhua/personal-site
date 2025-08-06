import { useEffect, useState, useRef } from 'react';
import './FloatingClouds.css';

export default function FloatingClouds() {

    interface Cloud {
        id: number;
        axis: number;
    }

    const [cloudArray, setCloudArray] = useState<Cloud[]>([]);

    const generatingCloud = useRef<boolean>(false);

    const cloudId = useRef<number>(1);

    const interruptCloudGeneration = useRef<boolean>(false);

    const generateNewCloud = () => {

        if (interruptCloudGeneration.current) return;

        // Get random number to determine starting y position
        const axis = Math.floor(Math.random() * 100) + 1;

        const cloudObject: Cloud = { id: cloudId.current, axis: axis };
        cloudId.current++;

        setCloudArray(current => [...current, cloudObject]);

        setTimeout(() => generateNewCloud(), 5000);

    }

    const handleAnimationEnd = (id: number) => {
        setCloudArray(current => current.filter(cloud => cloud.id !== id));
    }

    useEffect(() => {

        const clearCloudArray = () => {

            // Stops the nested loop when clicking out of tab, starts the nested loop when clicking in
            if (document.visibilityState === 'hidden') {
                interruptCloudGeneration.current = true;
            } else if (document.visibilityState === 'visible') {
                interruptCloudGeneration.current = false;
                generateNewCloud();
            }

            // Clears all existing clouds regardless
            setCloudArray([]);

        }

        /* Clears all clouds when coming back to window as all the clouds will build up but stay at the left.
           So it looks weird when a bunch of bundled clouds move to the side at the same time when coming back. */
        document.addEventListener('visibilitychange', clearCloudArray);

        // Prevents multiple triggers of this causing too many to be created
        if (!generatingCloud.current) {
            generateNewCloud();
            generatingCloud.current = true;
        }

        return () => {
            document.removeEventListener('visibilitychange', clearCloudArray);
        }

        // eslint-disable-next-line
    }, [])

    return (
        <div className='cloudContainer'>
            {
                cloudArray.map((cloud) => (
                    <div key={cloud.id} className='cloud' style={{ top: `${cloud.axis}%` }} onAnimationEnd={() => handleAnimationEnd(cloud.id)}></div>
                ))
            }
        </div>
    )
}