import { useEffect, useState, useRef, useCallback } from 'react';
import { useLogIn } from '../../context/LogInContext';
import './ContactChat.css';
import IgnoreScroll from '../IgnoreScroll/IgnoreScroll';

export default function ContactChat() {

    const [displayToggle, setDisplayToggle] = useState<'list' | 'solo'>('solo');
    const emailToView = useRef<string>('');

    const currentDate = useRef<string | null>(null);

    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const messageTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const { loggedIn, accessToken, accountEmail, tokenUpdates } = useLogIn();

    const wsRef = useRef<WebSocket | null>(null);

    type listType = {
        otherUser: string,
        sentBy: string,
        messageContent: string,
        profileImageUrl: string,
        createdAt: string
    }

    type messageType = {
        sender: string,
        message: string,
        direction: 'incoming' | 'outgoing',
        profileImageUrl?: string,
        createdAt: string
    }

    type sqlMessage = {
        message_id: string,
        sent_by: string,
        recipent: string,
        message_content: string,
        created_at: string,
        profile_image_url?: string
    }

    const [listToDisplay, setListToDisplay] = useState<listType[]>([]);
    const [messagesToDisplay, setMessagesToDisplay] = useState<messageType[]>([]);

    // Initial setup of displayToggle, to be triggered only once. If owner logs in, show list instead of solo
    useEffect(() => {
        /* We have to put this in a seperate useEffect because the main useEffect has displayToggle as a dependency.
           This means if we're on list and try to switch to solo, the if function below will trigger and switch us
           back to list again. */
        if (accountEmail.current === process.env.REACT_APP_DEFAULT_CHAT_EMAIL) {
            setDisplayToggle('list');
        }
    }, [loggedIn])

    useEffect(() => {

        const email = accountEmail.current;

        // Set initial welcome message
        setMessagesToDisplay([{
            sender: 'Jun Hua',
            message: "Hey there! 👋 How may I help you?\n\nPlease note that you need to have an account on this website, and be logged in, if you want to send a message here!",
            direction: 'incoming',
            profileImageUrl: '/img/transparent_profile.png',
            createdAt: ''
        }]);

        // The rest of the codes below this are meant for logged in users only
        if (email.trim() === '' || email === null) {
            console.log('WebSocket Setup: User is either not logged in or their email is not recorded');
            return;
        }

        /* Pre-define cleanup as both 'solo' and 'list' may have their own cleanups that include variables exclusive to each other.
           So if we we went down the 'list' path, any 'solo' cleanup code will throw an error, and vice versa. */
        let cleanup;

        if (displayToggle === 'solo') {

            const setupWebSocket = async () => {

                // Chat messaging is intended for signed in users only, this checks if we're logged in while updating our accessToken
                await tokenUpdates();
                const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/connectChat?accessToken=${accessToken.current}&email=${emailToView.current}`);

                ws.onopen = () => {
                    wsRef.current = ws;
                }

                ws.onmessage = (event) => {
                    const { type, messages, message, email } = JSON.parse(event.data);

                    const newMessage = (message: sqlMessage) => {
                        setMessagesToDisplay(current => {
                            const { sent_by, message_content, profile_image_url, created_at } = message;
                            const array = [...current];
                            array.push({
                                sender: sent_by === process.env.REACT_APP_DEFAULT_CHAT_EMAIL ? 'Jun Hua' : sent_by,
                                message: message_content,
                                direction: sent_by === email ? 'outgoing' : 'incoming',
                                profileImageUrl: sent_by === process.env.REACT_APP_DEFAULT_CHAT_EMAIL ? '/img/transparent_profile.png' : profile_image_url,
                                createdAt: created_at
                            });
                            return array;
                        });
                    }

                    switch (type) {
                        case 'message':
                            if (!messageTextAreaRef.current) throw new Error('Message input ref not detected on message');
                            newMessage(message);
                            break;
                        case 'loadPreviousMessages':
                            for (const msg of messages) {
                                newMessage(msg);
                            }
                            break;
                    }
                }

            }

            // Timeout so it can be cancelled if this useEffect is called multiple times back to back in a short timeframe
            const webSocketTimeout = setTimeout(setupWebSocket, 500);

            cleanup = () => {
                // Clear timeout to prevent multiple websocket connections due to rapid casts of this useEffect
                clearTimeout(webSocketTimeout)

                // Cleanup to close connection
                if (wsRef.current) {
                    wsRef.current.close();
                }
            }
        } else {
            const fetchList = async () => {
                await tokenUpdates();
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchMessageList`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ accessTokenJwt: accessToken.current })
                });

                if (!res.ok) {
                    console.error('Fetch failed:', res.status, res.statusText, await res.text());
                    return;
                }

                const result = await res.json();
                setListToDisplay(result);
            }

            // Timeout so it can be cancelled if this useEffect is called multiple times back to back in a short timeframe
            const fetchListTimeout = setTimeout(fetchList, 500);

            cleanup = () => {
                // Clear timeout to prevent multiple fetches due to rapid casts of this useEffect
                clearTimeout(fetchListTimeout)
            }
        }

        return cleanup;

        // eslint-disable-next-line
    }, [loggedIn, displayToggle]);

    const openSoloChat = (email: string) => {
        setDisplayToggle('solo');
        emailToView.current = email;
    }

    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const mTAF = messageTextAreaRef.current;
            if (!mTAF) throw new Error('Message Box not detected on send');
            const input: string = mTAF.value;
            if (input.trim() !== '' && input) {
                wsRef.current.send(input);
                mTAF.value = '';
            }
        }
    }

    // Trigger once on startup to get the textarea's base scroll height as reference

    const baseScrollHeight = useRef<number>(0);
    const [currentRows, setCurrentRows] = useState<number>(1);

    // In order to trigger IgnoreScroll's useEffect to re-evaluate mTAR's scrollHeight to apply ignoreNavUp/Down, we need to force a re-render
    const [, reRender] = useState<number>(0);

    // Initial setup to get the height of one row of mTAR for calculation later
    const setupMessageTextArea = useCallback((node: HTMLTextAreaElement | null) => {
        messageTextAreaRef.current = node;
        const mTAR = messageTextAreaRef.current;
        if (mTAR !== null) {
            baseScrollHeight.current = mTAR.scrollHeight;
        }
    }, []);

    // Initial setup to make messages start from the bottom
    const setupMessageBox = useCallback((node: HTMLDivElement | null) => {
        messageBoxRef.current = node;
        const mBR = messageBoxRef.current;
        if (mBR !== null) {
            mBR.scrollTop = mBR.scrollHeight;
        }
    }, []);

    // Manually adjusting the rows of the textarea based on the new scrollHeight with a min of 1 row and max of 4 rows
    const handleTextAreaChange = () => {
        const mTAR = messageTextAreaRef.current;
        if (!mTAR) throw new Error('Message Box not detected on send');
        // We need to reset it back to 1 first for scenarios where you go from 4 to 3 rows as scrollHeight won't change, thus remaining fixed at 4 rows even with 3 or less rows of actual content
        mTAR.rows = 1;
        mTAR.rows = Math.min(Math.ceil(mTAR.scrollHeight / baseScrollHeight.current), 4);
        setCurrentRows(mTAR.rows);
        reRender(n => n + 1);
    }

    return (
        <div className='chatWindow'>
            {displayToggle === 'list' && (<IgnoreScroll>
                <div className='messageList'>
                    {listToDisplay.map((message, index) => {
                        const timestampz = new Date(message.createdAt);

                        // If timestampz is an invalid Date, don't render any time related elements
                        let skipTime: boolean = isNaN(timestampz.getTime());

                        let timestampToDisplay = '';
                        if (timestampz.getDate() === new Date().getDate()) {
                            timestampToDisplay = timestampz.toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            });
                        } else {
                            timestampToDisplay = timestampz.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            });
                        }
                        return <>
                            {index > 0 && (<div className='messageListItemDivider'></div>)}
                            <div className='messageListItem' onClick={() => openSoloChat(message.otherUser)}>
                                <div className='profileImage' style={{ backgroundImage: `url(${message.profileImageUrl ?? '/img/default_profile.png'})` }}></div>
                                <div className='messageListItemTexts'>
                                    <h2 className='mLITUser'>{message.otherUser}</h2>
                                    <p className='mLITMessage'>{message.messageContent}</p>
                                </div>
                                {!skipTime && (<p className='mLITTime'>{timestampToDisplay}</p>)}
                            </div>
                        </>
                    })}
                </div>
            </IgnoreScroll>)}
            {displayToggle === 'solo' && (<>
                <IgnoreScroll>
                    <div className='messageBox' ref={setupMessageBox}>
                        {
                            messagesToDisplay.map((message) => {
                                const ownMessage = message.direction === 'outgoing';
                                const timestampz = new Date(message.createdAt);

                                // If timestampz is an invalid Date, don't render any time related elements
                                let skipTime: boolean = isNaN(timestampz.getTime());

                                // Controls whether the dateLineBreak should be rendered depending on if it's a new Date
                                let newDate: boolean = false

                                const date = timestampz.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                });
                                const time = timestampz.toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                });
                                /*  If it's the first date due to currentDate being null or if it's a new date due to it not being equal to the currentDate, 
                                    we should update it. */
                                if (currentDate.current !== date) {
                                    newDate = true;
                                    currentDate.current = date;
                                }


                                return <>
                                    {!skipTime && newDate && (<div className='dateLineBreak'>
                                        <div className='dateLine'></div>
                                        {!skipTime && (<p className='dateLineText'>{date}</p>)}
                                        <div className='dateLine'></div>
                                    </div>)}
                                    <div className={`messageObject ${ownMessage ? 'right' : 'left'}`}>
                                        {!ownMessage && (<div className='profileImage' style={{ backgroundImage: `url(${message.profileImageUrl ?? '/img/default_profile.png'})` }}></div>)}
                                        <div className='message'>
                                            <p className='messageText'>
                                                {!ownMessage && (<span style={{ fontWeight: 'bold' }}>{message.sender}<br /><br /></span>)}
                                                {message.message}
                                            </p>
                                            {!skipTime && (<p className='messageTime'>{time}</p>)}
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </IgnoreScroll>
                <div className='chatFooter'>
                    <div className='messageTextBox' style={{ height: `${50 + ((currentRows - 1) * baseScrollHeight.current)}px` }}>
                        <IgnoreScroll>
                            <textarea ref={setupMessageTextArea} className='messageTextArea' disabled={!loggedIn} placeholder='Enter your message here' rows={1} onChange={handleTextAreaChange}></textarea>
                        </IgnoreScroll>
                    </div>
                    <button className='messageSendBtn' onClick={sendMessage}><div className="arrow right"></div></button>
                </div>
            </>)}
        </div>
    )
}