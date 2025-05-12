import React from 'react';
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

    return (
        <nav className='navbar'>
            <div className='leftNav'>
                <div className='nameLogo' onClick={handleNavClick}>
                    <img className='navObject' id='home' src='./personal-site/img/name_logo.png' alt='JUN HUA' style={{ padding: '20px' }} />
                </div>
            </div>
            <div className='middleNav'>
                <ul className='navLinks' onClick={handleNavClick}>
                    <li className='navObject' id='about'>About Me</li>
                    <li className='navObject' id='projects'>My Projects</li>
                    <li className='navObject' id='info'>Website Info</li>
                    <li className='navObject' id='contact'>Contact</li>
                </ul>
            </div>
            <div className='rightNav'>
                <div className='signinLogin'>
                    <button className='signinButton'>Sign In</button>
                </div>
            </div>
        </nav>
    )
}