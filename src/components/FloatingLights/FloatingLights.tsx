import { useEffect, useState, useRef } from 'react';
import './FloatingLights.css';

export default function FloatingLights() {

    interface Light {
        id: number;
        axis: number;
    }

    const [lightArray, setLightArray] = useState<Light[]>([]);

    const generatingLight = useRef<boolean>(false);

    const lightId = useRef<number>(1);

    const interruptLightGeneration = useRef<boolean>(false);

    const generateNewLight = () => {

        if (interruptLightGeneration.current) return;

        // Get random number to determine starting x position
        const axis = Math.floor(Math.random() * 100) + 1;

        const lightObject: Light = { id: lightId.current, axis: axis };
        lightId.current++;

        setLightArray(current => [...current, lightObject]);

        setTimeout(() => generateNewLight(), 500);

    }

    const handleAnimationEnd = (id: number) => {
        setLightArray(current => current.filter(light => light.id !== id));
    }

    useEffect(() => {

        const clearLightArray =()=> {

            // Stops the nested loop when clicking out of tab, starts the nested loop when clicking in
            if (document.visibilityState === 'hidden') {
                interruptLightGeneration.current = true;
            } else if (document.visibilityState === 'visible') {
                interruptLightGeneration.current = false;
                generateNewLight();
            }

            // Clears all existing lights regardless
            setLightArray([]);

        }

        /* Clears all lights when coming back to window as all the lights will build up but stay at the bottom.
           So it looks weird when a bunch of bundled lights move up at the same time when coming back. */
        document.addEventListener('visibilitychange', clearLightArray);

        // Prevents multiple triggers of this causing too many to be created
        if (!generatingLight.current) {
            generateNewLight();
            generatingLight.current = true;
        }

        return ()=>{
            document.removeEventListener('visibilitychange', clearLightArray);
        }

        // eslint-disable-next-line
    }, [])

    return (
        <>
            {
                lightArray.map((light) => (
                    <div key={light.id} className='light' style={{ left: `${light.axis}%` }} onAnimationEnd={()=>handleAnimationEnd(light.id)}></div>
                ))
            }
        </>
    )
}