import { useEffect, useState } from 'react';
import './Home.css';
import NavBar from '../../components/NavBar/NavBar';
import FloatingClouds from '../../components/FloatingClouds/FloatingClouds';
import AboutMe from '../../sections/AboutMe/AboutMe';
import HeroWelcome from '../../sections/HeroWelcome/HeroWelcome';
import MyProjects from '../../sections/MyProjects/MyProjects';
import WebsiteInfo from '../../sections/WebsiteInfo/WebsiteInfo';
import Contact from '../../sections/Contact/Contact';
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
            <section className='heroWelcomeScreen' ref={navRefs.home}>
                <HeroWelcome key={projectKey} />
            </section>
            <section className='aboutMe' ref={navRefs.about}>
                <AboutMe key={projectKey} />
            </section>
            <section className='myProjects' ref={navRefs.projects}>
                <MyProjects key={projectKey} />
            </section>
            <section className='websiteInfo' ref={navRefs.info}>
                <WebsiteInfo key={projectKey} />
                <div className='overlay'></div>
                <FloatingClouds />
                <div className='sunBg'>
                    <div className='sunContainer'>
                        <div className='sun'></div>
                    </div>
                </div>
            </section>
            <section className='contact' ref={navRefs.contact}>
                <Contact key={projectKey} />
                <div className='overlay'></div>
                <FloatingClouds />
                <div className='moonBg'>
                    <div className='moonContainer'>
                        <div className='moon'></div>
                    </div>
                </div>
            </section>
        </>
    )
}
