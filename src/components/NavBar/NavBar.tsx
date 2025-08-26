import React, { useEffect, useState, useRef } from 'react';
import TextInputMovingLabel, { TIMLHandle } from '../TextInputMovingLabel/TextInputMovingLabel';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useLogIn } from '../../context/LogInContext';
import { useNav } from '../../context/NavigationContext';
import './NavBar.css';

export default function NavBar() {

    const { navigateJumpTo, pauseScroll } = useNav();

    // Gets the id of a nav object to communicate with the site which section to scroll to
    const handleNavClick = (e: any) => {

        // Ensures that is from a navObject and not accidentally triggered by any unintended elements
        if (e.target.className === 'navObject') {
            navigateJumpTo(e.target.id);
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
            pauseScroll.current = false;
        }
    }

    // Expands to show middleNav for mobile when hamburgerButton is clicked
    const handleHamburgerClick = () => {
        if (middleNavRef.current && rightNavRef.current) {
            if (middleNavRef.current.classList.contains('middleNavMobileActive') && rightNavRef.current.classList.contains('rightNavMobileActive')) {

                // For when the Hamburger Button is clicked while the menu is active
                middleNavRef.current.classList.remove('middleNavMobileActive');
                rightNavRef.current.classList.remove('rightNavMobileActive');
                pauseScroll.current = false;

            } else {

                // For when the Hamburger Button is clicked to show the menu
                middleNavRef.current.classList.add('middleNavMobileActive');
                rightNavRef.current.classList.add('rightNavMobileActive');
                pauseScroll.current = true;

            }
        }
    }

    /* == Sign In/Sign Up Related Declarations == */

    // If true, it means it should show Sign In, if false Sign Up, hence the name signInNotUp
    const [signInFormState, setSignInFormState] = useState<'SignIn' | 'SignUp' | 'ForgetPassword' | 'ResetPassword' | 'VerifyEmail' | 'SuccessSignIn' | 'SuccessSignUp' | 'SuccessResetPassword'>('SignIn');

    const [signInHeaderText, setSignInHeaderText] = useState<'Sign In' | 'Sign Up' | 'Forget Password' | 'Reset Password' | 'Verify Email Address' | 'Success'>('Sign In');
    const [signInDescriptionText, setSignInDescriptionText] = useState<string>('Welcome back! Sign in to get access to features such as direct chat message and future game implementations!');

    const [passwordAutoComplete, setPasswordAutoComplete] = useState<'off' | 'current-password'>('current-password');

    const [tSIOPreText, setTSIOPreText] = useState<string>("Don't have an account?");
    const [tSIOText, setTSIOText] = useState<string>('Sign Up');

    const [signInPillText, setSignInPillText] = useState<'Sign In' | 'Sign Up' | 'Reset Password' | 'Confirm Verification Code'>('Sign In');

    const { loggedIn, updateLogIn, signOut } = useLogIn();

    const [revealPasswords, setRevealPasswords] = useState<boolean>(false);
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const emailRef = useRef<TIMLHandle | null>(null);
    const pwRef = useRef<TIMLHandle | null>(null);
    const confirmPwRef = useRef<TIMLHandle | null>(null);
    const verifyEmailRef = useRef<TIMLHandle | null>(null);

    const emailKey = useRef<string>('');
    const passwordKey = useRef<string>('');

    const clearAllErrors = () => {
        if (emailRef.current) emailRef.current.setError('');
        if (pwRef.current) pwRef.current.setError('');
        if (confirmPwRef.current) confirmPwRef.current.setError('');
        if (verifyEmailRef.current) verifyEmailRef.current.setError('');
    }

    // Change Sign In Form's text based on form state
    useEffect(() => {
        clearAllErrors();
        switch (signInFormState) {
            case 'SignIn':
                setSignInHeaderText('Sign In');
                setSignInDescriptionText('Welcome back! Sign in to get access to features such as direct chat message and future game implementations!');
                setPasswordAutoComplete('current-password');
                setSignInPillText('Sign In');
                setTSIOPreText("Don't have an account?");
                setTSIOText('Sign Up');
                break;
            case 'SignUp':
                setSignInHeaderText('Sign Up');
                setSignInDescriptionText('New here? Welcome! Sign up to get access to features such as direct chat message and future game implementations!');
                setPasswordAutoComplete('off');
                setSignInPillText('Sign Up');
                setTSIOPreText('Already have an account?');
                setTSIOText('Sign In');
                break;
            case 'ForgetPassword':
                setSignInDescriptionText('Forgot your password? No problem, enter the email you signed up with to get started on the recovery process!');
                setSignInHeaderText('Forget Password');
                setSignInPillText('Reset Password');
                setTSIOPreText('Remembered your password?');
                setTSIOText('Sign In');
                break;
            case 'ResetPassword':
                setSignInHeaderText('Reset Password');
                setSignInDescriptionText("A verification code has also been sent to your email, enter the code below, along with your new password, to verify it's you.");
                setSignInPillText('Reset Password');
                setTSIOPreText("Reset the password for another account?");
                setTSIOText('Forget Password');
                break;
            case 'VerifyEmail':
                setSignInHeaderText('Verify Email Address');
                setSignInDescriptionText('A verification code has been sent to the email you signed up with, enter it below to finish creating your account!');
                setSignInPillText('Confirm Verification Code');
                setTSIOPreText('Want to change something?');
                setTSIOText('Sign Up');
                break;
            case 'SuccessResetPassword':
                setSignInHeaderText('Success');
                setSignInDescriptionText("Your password has successfully been reset, and you've been logged in for your convenience! You may now close this window.");
                break;
            case 'SuccessSignIn':
                setSignInHeaderText('Success');
                setSignInDescriptionText('Welcome! You have successfully logged in, you may close this window now.');
                break;
            case 'SuccessSignUp':
                setSignInHeaderText('Success');
                setSignInDescriptionText('Welcome! Your account has been successfully created! You have been automatically logged in and may close this window now.');
                break;
        }

        // Stop loading when form state changes, be it a successful interaction or user clicked to view something else
        setLoadingState(false);
    }, [signInFormState]);

    // Handles event based on form state when form is submitted
    const toggleSignInOut = () => {
        switch (signInFormState) {
            // From Sign In or Verify Email (OTP), toggle to Sign Up form
            case 'SignIn':
            case 'VerifyEmail':
                setSignInFormState('SignUp');
                break;
            // From Sign Up or Forget Password, toggle to Sign In form
            case 'SignUp':
            case 'ForgetPassword':
                setSignInFormState('SignIn');
                break;
            // From Reset Password, toggle to Forget Password
            case 'ResetPassword':
                setSignInFormState('ForgetPassword');
                break;
        }
    }

    const toggleSignInForgetPassword = () => {
        // From Sign In, toggle to Forget Password form
        if (signInFormState === 'SignIn') {
            setSignInFormState('ForgetPassword');
        }
    }

    const handleSignInButtonClick = () => {
        const sIPR = signInPopupRef.current;
        if (!sIPR) throw new Error('Sign In Popup Ref not detected on sign in button click');
        sIPR.classList.remove('signInPopupInactive');
        sIPR.classList.add('signInPopupActive');
        pauseScroll.current = true;
    }

    const handleSignOutButtonClick = async () => {
        setSignInFormState('SignIn');
        await signOut();
    }

    const closeSignInPopup = () => {
        const sIPR = signInPopupRef.current;
        if (!sIPR) throw new Error('Sign In Popup Ref not detected on close sign in popup');
        sIPR.classList.remove('signInPopupActive');
        sIPR.classList.add('signInPopupInactive');
        pauseScroll.current = false;
    }

    // THE MAIN HANDLER FOR CLICKING THE BUTTON IN THE FORM
    const signInProcess = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevents default behaviour like page reloading when form is submitted, retaining any input values to be handled
        e.preventDefault();
        clearAllErrors();

        /* When user clicks the button to submit the form, start loading as the fetches may take a while. Giving feedback will prevent
           users from thinking it might be an error and try to click again or click off. Once loading starts, there's only two places
           that'll stop the loading. When there's an error message to handle, or the form state changes due to success or user clicking
           off to view another part of the form. */
        setLoadingState(true);

        // Find out the current intent of the form, be it to sign in/sign up/verify email with code/reset password
        const currentState = signInFormState;

        let eRef: TIMLHandle | null = null;
        let pRef: TIMLHandle | null = null;
        let cRef: TIMLHandle | null = null;
        let vRef: TIMLHandle | null = null;

        let email = '';
        let password = '';
        let confirmPassword = '';
        let verifyEmail = '';

        /* The following 'ifs' are to initialize the different inputs like email, password, confirm password, verification code as they refs are currently
           null and the values blank, as seen right above this. We have to specify the form state as some form states like ForgetPassword may not have 
           inputs like password or confirm password, so to avoid getting thrown an error for not having fields that are irrelevant, we only declare them
           when we expect them in that specific form state. */

        if (['SignIn', 'SignUp', 'ForgetPassword'].includes(currentState)) {
            eRef = emailRef.current;
            if (!eRef) throw new Error('emailRef not detected at form submission');

            email = eRef.getInput();
        }

        if (['SignIn', 'SignUp', 'ResetPassword'].includes(currentState)) {
            pRef = pwRef.current;
            if (!pRef) throw new Error('pwRef not detected at form submission');

            password = pRef.getInput();
        }

        if (['SignUp', 'ResetPassword'].includes(currentState)) {
            cRef = confirmPwRef.current;
            if (!cRef) throw new Error('confirmPwRef not detected at form submission');

            confirmPassword = cRef.getInput();
        }

        if (['VerifyEmail', 'ResetPassword'].includes(currentState)) {
            vRef = verifyEmailRef.current;
            if (!vRef) throw new Error('verifyEmailRef not detected at form submission');

            verifyEmail = vRef.getInput();
        }

        type ValidateResult = {
            validatePass: boolean
            errorMessage: { email: string, password: string, confirmPassword: string, verifyEmail: string }
            value: { accessToken: string, email: string }
        }

        // Based on the result from fetch requests, assign the error message to their corresponding inputs
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

        // Sends different fetch requests based on the form state
        if (currentState === 'VerifyEmail') {
            if (verifyEmailValidation()) {

                const verifyVerificationCode = async () => {
                    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/verifyVerificationCode`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email: emailKey.current, password: passwordKey.current, codeInput: verifyEmail })
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
                        updateLogIn({ aT: result.value.accessToken, e: result.value.email, sLI: true });
                        setSignInFormState('SuccessSignUp');
                    }
                }

                verifyVerificationCode();
            }
        }

        if (currentState === 'ForgetPassword') {
            if (emailValidation()) {
                const forgetPasswordFetch = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/forgetPassword`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email }),
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
                            setSignInFormState('ResetPassword');
                            emailKey.current = email;
                        }
                    } catch (error) {
                        console.error('Network error:', error);
                    }
                };

                forgetPasswordFetch();
            }
        }

        if (currentState === 'ResetPassword') {
            if (passwordValidation() && confirmPasswordValidation() && verifyEmailValidation()) {

                const resetPassword = async () => {
                    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/resetPassword`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email: emailKey.current, password: password, confirmPassword: confirmPassword, codeInput: verifyEmail })
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
                        updateLogIn({ aT: result.value.accessToken, e: result.value.email, sLI: true });
                        setSignInFormState('SuccessResetPassword');
                    }
                }

                resetPassword();
            }
        }

        if (currentState === 'SignIn') {
            if (emailValidation() && passwordValidation()) {
                const signInFetch = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/signIn`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({ email: email, password: password }),
                        });

                        if (!res.ok) {
                            console.error('Fetch failed:', res.status, res.statusText);
                            return;
                        }

                        const result = await res.json();

                        if (!result.validatePass) {
                            handleErrorDisplay(result);
                        } else {
                            updateLogIn({ aT: result.value.accessToken, e: result.value.email, sLI: true });
                            setSignInFormState('SuccessSignIn');
                        }
                    } catch (error) {
                        console.error('Network error:', error);
                    }
                };

                signInFetch();
            }
        }

        if (currentState === 'SignUp') {
            if (emailValidation() && passwordValidation() && confirmPasswordValidation()) {
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

                        // Only trigger error display when the validation is marked as fail
                        if (!result.validatePass) {
                            handleErrorDisplay(result);
                        } else {
                            setSignInFormState('VerifyEmail');
                            emailKey.current = email;
                            passwordKey.current = password;
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

    const confirmPasswordValidation = (trimmedCheck?: boolean) => {
        const pRef = pwRef.current;
        if (!pRef) throw new Error('pwRef not detected at front end validation');
        const cRef = confirmPwRef.current;
        if (!cRef) throw new Error('confirmPwRef not detected at front end validation');

        const password = pRef.getInput();
        const confirmPassword = cRef.getInput();

        if (confirmPassword.trim() === '') {
            if (!trimmedCheck) cRef.setError("This field can't be left blank or consist of only spaces");
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
                body: JSON.stringify({ email: emailKey.current, state: signInFormState })
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

    // useEffect to display the countdown timer live for resending verification code
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
                if (signInFormState === 'SignUp') {
                    confirmPasswordValidation(true);
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

    /* One of the ways loading should be stopped is when an error is received. There are multiple inputs though with multiple possible errors, as well as
       multiple points of validation. Rather than adding this setLoadingState(false) to every validation, and risk missing out on one, I instead have it
       react to when the input sends a signal saying it received an error. Just one error will cause the loading to stop with just this one funciton. */
    const handleErrorReceived = (error: string) => {
        if (error.trim() !== '') {
            setLoadingState(false);
        }
    }

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/googleAuth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ credentials: credentialResponse.credential })
        });

        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            return;
        }

        const result = await res.json();

        // validatePass has been repurposed to determine if user already had an account or not, true means they had one, false means they just created one
        if (result.validatePass) {
            setSignInFormState('SuccessSignIn');
        } else {
            setSignInFormState('SuccessSignUp');
        }

        updateLogIn({ aT: result.value.accessToken, e: result.value.email, sLI: true });
    }

    return (
        <>
            <div className='signInPopup signInPopupInactive' ref={signInPopupRef}>
                <div className='signInMenu'>
                    <div className='closeButton' onClick={closeSignInPopup}>
                        <div className='xIcon'></div>
                    </div>
                    <h1 className='signInHeaderText'>{signInHeaderText}</h1>
                    <p className='signInDescriptionText'>{signInDescriptionText}</p>
                    <form onSubmit={loadingState ? (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault() } : signInProcess}>
                        {['SignIn', 'SignUp'].includes(signInFormState) && (
                            <GoogleLogin
                                onSuccess={credentialResponse => handleGoogleSuccess(credentialResponse)}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                text='continue_with'
                                shape='pill'
                            />
                        )}
                        {['SignIn', 'SignUp', 'ForgetPassword'].includes(signInFormState) && (<TextInputMovingLabel ref={emailRef} type='email' id='email' autoComplete='email' labelText='Email Address' validateInput={(id) => handleValidation(id)} errorReceived={(error) => handleErrorReceived(error)} />)}
                        {['SignIn', 'SignUp', 'ResetPassword'].includes(signInFormState) && (<TextInputMovingLabel ref={pwRef} type={revealPasswords ? 'text' : 'password'} id='password' autoComplete={passwordAutoComplete} labelText='Password' validateInput={(id) => handleValidation(id)} errorReceived={(error) => handleErrorReceived(error)} />)}
                        {['SignUp', 'ResetPassword'].includes(signInFormState) && (<TextInputMovingLabel ref={confirmPwRef} type={revealPasswords ? 'text' : 'password'} id='confirmPassword' autoComplete='off' labelText='Confirm Password' validateInput={(id) => handleValidation(id)} errorReceived={(error) => handleErrorReceived(error)} />)}
                        {['VerifyEmail', 'ResetPassword'].includes(signInFormState) && (<TextInputMovingLabel ref={verifyEmailRef} type='text' id='verifyEmail' autoComplete='off' labelText='Verification Code' validateInput={(id) => handleValidation(id)} errorReceived={(error) => handleErrorReceived(error)} />)}
                        {['VerifyEmail', 'ResetPassword'].includes(signInFormState) && (<p className={`clickableLink resendVerificationCodeText ${resendTimerText !== 0 ? 'disableResend' : ''}`} onClick={getNewVerificationCode}>Resend verification code {(resendTimerText !== 0 && (<span className='resendTimer'>in {resendTimerText}</span>))}</p>)}
                        {['SignIn', 'SignUp', 'ResetPassword'].includes(signInFormState) && (<div className='peekPasswordContainer'><input type='checkbox' id='peekCheckbox' checked={revealPasswords} onChange={(e) => setRevealPasswords(e.target.checked)}></input><label htmlFor='peekCheckbox'>{revealPasswords ? 'Hide Passwords' : 'View Passwords'}</label></div>)}
                        {['SignIn', 'SignUp', 'ForgetPassword', 'VerifyEmail', 'ResetPassword'].includes(signInFormState) && (<button className='signInPill' type='submit'>{loadingState ? (<>Loading...<span className='loadingSpinner'></span></>) : signInPillText}</button>)}
                    </form>
                    {['SignIn'].includes(signInFormState) && (<p className='clickableLink forgetPasswordText' onClick={toggleSignInForgetPassword}>Forgot your password?</p>)}
                    {['SignIn', 'SignUp', 'ForgetPassword', 'VerifyEmail', 'ResetPassword'].includes(signInFormState) && (<p className='toggleSignInOut'>{tSIOPreText} <span className='clickableLink' onClick={toggleSignInOut} style={{ whiteSpace: 'nowrap' }}>{tSIOText}</span></p>)}
                </div>
                <div className='signInBackground' onClick={closeSignInPopup}></div>
            </div>
            <nav className='navbar'>
                <div className='leftNav'>
                    <div className='nameLogo' onClick={handleNavClick}>
                        <img className='navObject' id='home' src={`${process.env.REACT_APP_BASE_CDN_URL}/img/name_logo.png`} alt='JUN HUA' style={{ padding: '20px' }} />
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
                    {loggedIn ? (<button className='signInOutButton signOutButton' onClick={handleSignOutButtonClick}>Sign Out</button>) : (<button className='signInOutButton signInButton' onClick={handleSignInButtonClick}>Sign In</button>)}
                    <div className='hamburgerButton' onClick={handleHamburgerClick}>
                        <div className='hamburgerIcon'></div>
                    </div>
                </div>
            </nav>
        </>
    )
}