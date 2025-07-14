import { useEffect, useState, useRef } from 'react';
import './Home.css';
import NavBar from '../../components/NavBar/NavBar';
import AboutMe from '../../sections/AboutMe/AboutMe';
import HeroWelcome from '../../sections/HeroWelcome/HeroWelcome';
import MyProjects from '../../sections/MyProjects/MyProjects';
import WebsiteInfo from '../../sections/WebsiteInfo/WebsiteInfo';
import { useNav } from '../../context/NavigationContext';

export default function Home() {

    const { navRefs } = useNav();

    const [projectKey, setProjectKey] = useState<number>(0);
    useEffect(() => {
        const observer = new ResizeObserver(() => setProjectKey(current => current + 1));
        observer.observe(document.body);

        return () => { observer.disconnect() }
    }, [])

    return (
        <>
            <NavBar />
            <section className='hero-welcome-screen' ref={navRefs.home}>
                <HeroWelcome key={projectKey} />
            </section>
            <section className='about-me' id='about-me' ref={navRefs.about}>
                <AboutMe key={projectKey} />
            </section>
            <section className='my-projects' id='my-projects' ref={navRefs.projects}>
                <MyProjects key={projectKey} />
            </section>
            <section className='website-info' id='website-info' ref={navRefs.info}>
                <WebsiteInfo key={projectKey} />
            </section>
        </>
    )
}
