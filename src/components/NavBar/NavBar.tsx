import React, { useEffect, useState, useRef } from 'react';
import TextInputMovingLabel, { TIMLHandle } from '../TextInputMovingLabel/TextInputMovingLabel';
import './NavBar.css';

type navIds = 'home' | 'about' | 'projects'

interface NavProps {
    navigateRequest: (sectionId: navIds) => void
    pauseScroll: (pause: boolean) => void
}

export default function NavBar({ navigateRequest, pauseScroll }: NavProps) {

    // Gets the id of a nav object to communicate with the site which section to scroll to
    const handleNavClick = (e: any) => {

        // Ensures that is from a navObject and not accidentally triggered by any unintended elements
        if (e.target.className === 'navObject') {
            navigateRequest(e.target.id);
        }

    }

    const middleNavRef = useRef<HTMLDivElement | null>(null);
    const rightNavRef = useRef<HTMLDivElement | null>(null);
    const signInPopupRef = useRef<HTMLDivElement | null>(null);

    // Closes middleNav menu for mobile
    const handleMiddleNavClick = () => {
        if (middleNavRef.current && rightNavRef.current) {
            middleNavRef.current.classList.remove('middleNavMobileActive');
            rightNavRef.current.classList.remove('rightNavMobileActive');
            pauseScroll(false);
        }
    }

    // Expands to show middleNav for mobile when hamburgerButton is clicked
    const handleHamburgerClick = () => {
        if (middleNavRef.current && rightNavRef.current) {
            if (middleNavRef.current.classList.contains('middleNavMobileActive') && rightNavRef.current.classList.contains('rightNavMobileActive')) {

                // For when the Hamburger Button is clicked while the menu is active
                middleNavRef.current.classList.remove('middleNavMobileActive');
                rightNavRef.current.classList.remove('rightNavMobileActive');
                pauseScroll(false);

            } else {

                // For when the Hamburger Button is clicked to show the menu
                middleNavRef.current.classList.add('middleNavMobileActive');
                rightNavRef.current.classList.add('rightNavMobileActive');
                pauseScroll(true);

            }
        }
    }

    /* == Sign In/Sign Up Related Declarations == */

    // If true, it means it should show Sign In, if false Sign Up, hence the name signInNotUp
    const signInFormState = useRef<'SignIn' | 'SignUp' | 'ForgetPassword' | 'VerifyEmail'>('SignIn');

    const [signInHeaderText, setSignInHeaderText] = useState<'Sign In' | 'Sign Up' | 'Forget Password' | 'Verify Email Address'>('Sign In');
    const [signInDescriptionText, setSignInDescriptionText] = useState<string>('Welcome back! Sign in to get access to features such as PLACEHOLDER!!!!!');

    const [passwordAutoComplete, setPasswordAutoComplete] = useState<'new-password' | 'current-password'>('current-password');

    const [tSIOPreText, setTSIOPreText] = useState<string>("Don't have an account?");
    const [tSIOText, setTSIOText] = useState<string>('Sign Up');

    const [signInPillText, setSignInPillText] = useState<'Sign In' | 'Sign Up' | 'Reset Password' | 'Confirm Verification Code'>('Sign In');

    const toggleSignInOut = () => {
        switch (signInFormState.current) {
            // From Sign In or Verify Email (OTP), toggle to Sign Up form
            case 'SignIn':
            case 'VerifyEmail':
                signInFormState.current = 'SignUp';
                setSignInHeaderText('Sign Up');
                setSignInDescriptionText('New here? Welcome! Sign up to get access to features such as PLACEHOLDER!!!!!');
                setPasswordAutoComplete('new-password');
                setSignInPillText('Sign Up');
                setTSIOPreText('Already have an account?');
                setTSIOText('Sign In');
                break;
            // From Sign Up or Forget Password, toggle to Sign In form
            case 'SignUp':
            case 'ForgetPassword':
                signInFormState.current = 'SignIn';
                setSignInHeaderText('Sign In');
                setSignInDescriptionText('Welcome back! Sign in to get access to features such as PLACEHOLDER!!!!!');
                setPasswordAutoComplete('current-password');
                setSignInPillText('Sign In');
                setTSIOPreText("Don't have an account?");
                setTSIOText('Sign Up');
                break;
        }
    }

    const toggleSignInForgetPassword = () => {
        // From Sign In, toggle to Forget Password form
        if (signInFormState.current === 'SignIn') {
            signInFormState.current = 'ForgetPassword';
            setSignInDescriptionText('Forgot your password? No problem, enter the email you signed up with to get started on the recovery process!');
            setSignInHeaderText('Forget Password');
            setSignInPillText('Reset Password');
            setTSIOPreText('Remembered your password?');
            setTSIOText('Sign In');
        }
    }

    const handleSignInPopupClick = (e: any) => {
        // Trigger closing animation when clicking outside of the menu
        if (e.target.classList.contains('signInPopup')) {
            closeSignInPopup();
        }
    }

    const handleSignInButtonClick = () => {
        if (signInPopupRef.current) {
            signInPopupRef.current.classList.remove('signInPopupInactive');
            signInPopupRef.current.classList.add('signInPopupActive');
            pauseScroll(true);
        }
    }

    const handleSignInMenuCloseClick = () => {
        closeSignInPopup();
    }

    const closeSignInPopup = () => {
        if (signInPopupRef.current) {
            signInPopupRef.current.classList.remove('signInPopupActive');
            signInPopupRef.current.classList.add('signInPopupInactive');
            pauseScroll(false);
        }
    }

    const emailRef = useRef<TIMLHandle | null>(null);
    const pwRef = useRef<TIMLHandle | null>(null);
    const confirmPwRef = useRef<TIMLHandle | null>(null);
    const verifyEmailRef = useRef<TIMLHandle | null>(null);

    const emailKey = useRef<string>('');

    const signInProcess = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const currentState = signInFormState.current;

        let eRef: TIMLHandle | null = null;
        let pRef: TIMLHandle | null = null;
        let cRef: TIMLHandle | null = null;
        let vRef: TIMLHandle | null = null;

        let email = '';
        let password = '';
        let confirmPassword = '';
        let verifyEmail = '';

        if (['SignIn', 'SignUp', 'ForgetPassword'].includes(signInFormState.current)) {
            eRef = emailRef.current;
            if (!eRef) throw new Error('emailRef not detected at form submission');
            pRef = pwRef.current;
            if (!pRef) throw new Error('pwRef not detected at form submission');

            email = eRef.getInput();
            password = pRef.getInput();
        }

        if (['SignUp'].includes(signInFormState.current)) {
            cRef = confirmPwRef.current;
            if (!cRef) throw new Error('confirmPwRef not detected at form submission');

            confirmPassword = cRef.getInput();
        }

        if (['VerifyEmail'].includes(signInFormState.current)) {
            vRef = verifyEmailRef.current;
            if (!vRef) throw new Error('verifyEmailRef not detected at form submission');

            verifyEmail = vRef.getInput();
        }

        type ValidateResult = {
            validatePass: boolean
            errorMessage: { email: string, password: string, confirmPassword: string, verifyEmail: string }
        }

        const handleErrorDisplay = (result: ValidateResult) => {

            // Double confirms that the validate failed, and thus have errors to display
            if (!result.validatePass) {
                const errors = result.errorMessage;

                const trimmedEmailError = errors.email.trim();
                const trimmedPasswordError = errors.password.trim();
                const trimmedConfirmPasswordError = errors.confirmPassword.trim();
                const trimmedVerifyEmailError = errors.verifyEmail.trim();

                if (trimmedEmailError !== '' && eRef) {
                    eRef.setError(trimmedEmailError);
                }

                if (trimmedPasswordError !== '' && pRef) {
                    pRef.setError(trimmedPasswordError);
                }

                if (trimmedConfirmPasswordError !== '' && cRef) {
                    cRef.setError(trimmedConfirmPasswordError);
                }

                if (trimmedVerifyEmailError !== '' && vRef) {
                    vRef.setError(trimmedVerifyEmailError);
                }

            } else {
                throw new Error('handleErrorDisplay triggered when ValidateResult passed.');
            }
        }
        if (currentState === 'VerifyEmail') {
            if (verifyEmailValidation()) {

                const verifyVerificationCode = async () => {
                    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/verifyVerificationCode`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailKey.current, codeInput: verifyEmail })
                    });

                    if (!res.ok) {
                        console.error('Fetch failed:', res.status, res.statusText);
                        return;
                    }

                    const result = await res.json();

                    // Only trigger error display when the validation is marked as fail
                    if (!result.validatePass) {
                        handleErrorDisplay(result);
                    } else {
                        console.log('SUCCCESSSSSSSSSSS')
                    }
                }

                verifyVerificationCode();
            }
        } else if (emailValidation() && passwordValidation()) {

            if (currentState === 'SignIn') {
                const signInFetch = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/signIn`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, password: password }),
                        });

                        if (!res.ok) {
                            console.error('Fetch failed:', res.status, res.statusText);
                            return;
                        }

                        const data = await res.json();
                        console.log('Response data:', data);
                    } catch (error) {
                        console.error('Network error:', error);
                    }
                };

                signInFetch();
            } else if (currentState === 'SignUp' && confirmPasswordValidation()) {

                const signUpFetch = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/signUp`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword }),
                        });

                        if (!res.ok) {
                            console.error('Fetch failed:', res.status, res.statusText);
                            return;
                        }

                        const result = await res.json();
                        console.log(result);

                        // Only trigger error display when the validation is marked as fail
                        if (!result.validatePass) {
                            handleErrorDisplay(result);
                        } else {
                            signInFormState.current = 'VerifyEmail';
                            setSignInHeaderText('Verify Email Address');
                            setSignInDescriptionText('A verification code has been sent to the email you signed up with, enter it below to finish creating your account!');
                            setSignInPillText('Confirm Verification Code');
                            setTSIOPreText('Want to change something?');
                            setTSIOText('Sign Up');
                            emailKey.current = email;
                        }
                    } catch (error) {
                        console.error('Network error:', error);
                    }
                };

                signUpFetch();
            }

        }

    }

    /* == Error Related Declarations == */

    // See backend index.ts for explanation of regex
    const emailRegex = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

    // Simple regex, allowing any character, and checks if it has a minimum of 10 characters, no maximum
    const passwordRegex = /^.{10,}$/;

    // Allows any alphanuemerics with a length of 6
    const verifyEmailRegex = /^[a-zA-Z0-9]{6}$/;

    const emailValidation = () => {
        const eRef = emailRef.current;
        if (!eRef) throw new Error('emailRef not detected at front end validation');
        const email = eRef.getInput();

        if (email.trim() === '') {
            eRef.setError("This field can't be left blank or consist of only spaces");
            return false;
        }

        const emailValidated = emailRegex.test(email);
        if (!emailValidated) {
            eRef.setError('Enter a valid email address');
            return false;
        } else {
            return true;
        }
    }

    const passwordValidation = () => {
        const pRef = pwRef.current;
        if (!pRef) throw new Error('pwRef not detected at front end validation');
        const password = pRef.getInput();

        if (password.trim() === '') {
            pRef.setError("This field can't be left blank or consist of only spaces");
            return false;
        }

        const passwordValidated = passwordRegex.test(password);
        if (!passwordValidated) {
            pRef.setError('Password must be at least 10 characters');
            return false;
        } else {
            return true;
        }
    }

    const confirmPasswordValidation = () => {
        const pRef = pwRef.current;
        if (!pRef) throw new Error('pwRef not detected at front end validation');
        const cRef = confirmPwRef.current;
        if (!cRef) throw new Error('confirmPwRef not detected at front end validation');

        const password = pRef.getInput();
        const confirmPassword = cRef.getInput();

        if (confirmPassword.trim() === '') {
            cRef.setError("This field can't be left blank or consist of only spaces");
            return false;
        }

        if (password !== confirmPassword && password.trim() !== '') {
            cRef.setError('Both passwords must match');
            return false;
        } else {
            // Clears the message if they fixed it by changing the password field without focusing on confirmPassword
            cRef.setError('');
            return true;
        }
    }

    const verifyEmailValidation = () => {
        const vRef = verifyEmailRef.current;
        if (!vRef) throw new Error('verifyEmailRef not detected at front end validation');

        const verifyEmail = vRef.getInput();

        if (verifyEmail.trim() === '') {
            vRef.setError("This field can't be left blank or consist of only spaces");
            return false;
        }

        const verifyEmailValidated = verifyEmailRegex.test(verifyEmail);
        if (!verifyEmailValidated) {
            vRef.setError('Please enter a valid 6 character code');
            return false;
        } else {
            return true;
        }
    }

    const [resendTimerText, setResendTimerText] = useState<number>(0);

    const getNewVerificationCode = async () => {
        if (resendTimerText === 0) {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getNewVerificationCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailKey.current })
            });

            if (!res.ok) {
                console.error('Fetch failed:', res.status, res.statusText);
                return;
            } else {
                setResendTimerText(60);
            }
        } else {
            const vRef = verifyEmailRef.current;
            if (vRef) {
                vRef.setError('Please wait for timer to end before requesting a resend')
            }
        }
    }

    useEffect(() => {
        if (resendTimerText !== 0) {
            setTimeout(() => { setResendTimerText(currentTimer => currentTimer - 1) }, 1000);
        }
    }, [resendTimerText])

    const handleValidation = async (id: string) => {
        switch (id) {
            case 'email':
                emailValidation();
                break;
            case 'password':
                passwordValidation();
                // Check if newly entered password matches any existing value in confirm password when signing up
                if (signInFormState.current === 'SignUp') {
                    confirmPasswordValidation();
                }
                break;
            case 'confirmPassword':
                confirmPasswordValidation();
                break;
            case 'verifyEmail':
                verifyEmailValidation();
                break;
        }

    }

    return (
        <div>
            <div className='signInPopup signInPopupInactive' ref={signInPopupRef} onClick={handleSignInPopupClick}>
                <div className='signInMenu'>
                    <div className='closeButton' onClick={handleSignInMenuCloseClick}>
                        <div className='xIcon'></div>
                    </div>
                    <h1 className='signInHeaderText'>{signInHeaderText}</h1>
                    <p className='signInDescriptionText'>{signInDescriptionText}</p>
                    <form onSubmit={signInProcess}>
                        {['SignIn', 'SignUp', 'ForgetPassword'].includes(signInFormState.current) && (<TextInputMovingLabel ref={emailRef} type='email' id='email' autoComplete='email' labelText='Email Address' validateInput={(id) => handleValidation(id)} />)}
                        {['SignIn', 'SignUp'].includes(signInFormState.current) && (<TextInputMovingLabel ref={pwRef} type='password' id='password' autoComplete={passwordAutoComplete} labelText='Password' validateInput={(id) => handleValidation(id)} />)}
                        {['SignUp'].includes(signInFormState.current) && (<TextInputMovingLabel ref={confirmPwRef} type='password' id='confirmPassword' autoComplete='off' labelText='Confirm Password' validateInput={(id) => handleValidation(id)} />)}
                        {['VerifyEmail'].includes(signInFormState.current) && (<TextInputMovingLabel ref={verifyEmailRef} type='text' id='verifyEmail' autoComplete='off' labelText='Verification Code' validateInput={(id) => handleValidation(id)} />)}
                        {['SignIn'].includes(signInFormState.current) && (<div className='rememberMe'>
                            <input type='checkbox' id='rememberMeCheck'></input>
                            <label htmlFor='rememberMeCheck'>Remember Me</label>
                        </div>)}
                        {['VerifyEmail'].includes(signInFormState.current) && (<p className={`clickableLink resendVerificationCodeText ${resendTimerText !== 0 ? 'disableResend' : ''}`} onClick={getNewVerificationCode}>Resend verificaiton code {(resendTimerText !== 0 && (<span className='resendTimer'>in {resendTimerText}</span>))}</p>)}
                        <button className='signInPill' type='submit'>{signInPillText}</button>
                    </form>
                    {['SignIn'].includes(signInFormState.current) && (<p className='clickableLink forgetPasswordText' onClick={toggleSignInForgetPassword}>Forgot your password?</p>)}
                    <p className='toggleSignInOut'>{tSIOPreText} <span className='clickableLink' onClick={toggleSignInOut} style={{ whiteSpace: 'nowrap' }}>{tSIOText}</span></p>
                </div>
            </div>
            <nav className='navbar'>
                <div className='leftNav'>
                    <div className='nameLogo' onClick={handleNavClick}>
                        <img className='navObject' id='home' src='/img/name_logo.png' alt='JUN HUA' style={{ padding: '20px' }} />
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
                    <div className='signInLogin' onClick={handleSignInButtonClick}>
                        <button className='signInButton'>Sign In</button>
                    </div>
                    <div className='hamburgerButton' onClick={handleHamburgerClick}>
                        <div className='hamburgerIcon'></div>
                    </div>
                </div>
            </nav>
        </div>
    )
}