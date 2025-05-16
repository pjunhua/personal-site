import React, { useRef } from 'react';
import './NavBar.css';

interface NavProps {
    navigateRequest: (sectionId: string) => void
}

export default function NavBar({ navigateRequest }: NavProps) {

    // Gets the id of a nav object to communicate with the site which section to scroll to
    const handleNavClick = (e) => {

        // Ensures that is from a navObject and not accidentally triggered by any unintended elements
        if (e.target.className === 'navObject') {
            navigateRequest(e.target.id);
        }

    }

    const middleNavRef = useRef<HTMLDivElement | null>(null);
    const rightNavRef = useRef<HTMLDivElement | null>(null);

    // Closes middleNav menu for mobile
    const handleMiddleNavClick = () => {
        if (middleNavRef.current && rightNavRef.current) {
            middleNavRef.current.classList.remove('middleNavMobileActive');
            rightNavRef.current.classList.remove('rightNavMobileActive');
        }
    }

    // Expands to show middleNav for mobile when hamburgerButton is clicked
    const handleHamburgerClick = () => {
        if (middleNavRef.current && rightNavRef.current) {
            if (middleNavRef.current.classList.contains('middleNavMobileActive') && rightNavRef.current.classList.contains('rightNavMobileActive')) {

                // For when the Hamburger Button is clicked while the menu is active
                middleNavRef.current.classList.remove('middleNavMobileActive');
                rightNavRef.current.classList.remove('rightNavMobileActive');

            } else {

                // For when the Hamburger Button is clicked to show the menu
                middleNavRef.current.classList.add('middleNavMobileActive');
                rightNavRef.current.classList.add('rightNavMobileActive');

            }
        }
    }

    return (
        <nav className='navbar'>
            <div className='leftNav'>
                <div className='nameLogo' onClick={handleNavClick}>
                    <img className='navObject' id='home' src='/personal-site/img/name_logo.png' alt='JUN HUA' style={{ padding: '20px' }} />
                </div>
            </div>
            <div className='middleNav' ref={middleNavRef} onClick={handleMiddleNavClick}>
                <ul className='navLinks' onClick={handleNavClick}>
                    <li className='navObject' id='about'>About Me</li>
                    <li className='navObject' id='projects'>My Projects</li>
                    <li className='navObject' id='info'>Website Info</li>
                    <li className='navObject' id='contact'>Contact</li>
                </ul>
            </div>
            <div className='rightNav' ref={rightNavRef}>
                <div className='signinLogin'>
                    <button className='signinButton'>Sign In</button>
                </div>
                <div className='hamburgerButton' onClick={handleHamburgerClick}>
                    <div className='hamburgerIcon'></div>
                </div>
            </div>
        </nav>
    )
}