import React, { useState, useEffect } from 'react';
import Intro from './pages/Intro/Intro.tsx';
import Home from './pages/Home/Home.tsx';


export default function HomepageIntroHandler() {

    const [showIntro, setShowIntro] = useState<boolean>(true);

    useEffect(() => {

        const introPlayed = sessionStorage.getItem('introPlayed') === 'true';
        if (introPlayed) {
            setShowIntro(false);
        }

    }, [])

    const handleIntroFinish = () => {
        sessionStorage.setItem('introPlayed', "true");
        setShowIntro(false);
    }

    return (
        <>
            {showIntro ? <Intro onFinish={ handleIntroFinish } /> : <Home />}
        </>
    );
}