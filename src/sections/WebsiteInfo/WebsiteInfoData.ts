export type infoBubble = {
    title: string,
    description: string,
    tags: string[]
}

export const infoArray: infoBubble[] = [
    {
        title: 'Timebased Welcome Message',
        description: "This is what appears at the bottom of the home screen when you first enter the site, with the messages appearing in a typing animation. The messages shown are context based, if you're not signed in, it will display a standard welcome message to guide you on how to navigate the site. Otherwise, if you're signed in or if you click on the guide message, it will display custom messages based on the time, be it a morning greeting or a night greeting. While a message is typing, you can click on it to skip the animation and display the full message. I also made it so some custom messages will appear at a rarer rate almost like a gacha, so if you're interested feel free to cycle through the messages, there are 4 per time period.",
        tags: ['time', 'type', 'context', 'home']
    },
    {
        title: 'Alternative Scroll to Navigate',
        description: "You might've already realised but this website doesn't use a traditional scroll to view more content. This is because I'm overriding the normal scroll functions to instead perform an animation to show the next segment. The main reason I'm doing this is for the mobile experience. When you scroll down on mobile, it'll hide the search bar which affects the available height being displayed, and the inverse applies where the search bar appears when you scroll up again. This makes the website look wonky as I'm aiming to give a full-screen experience for each segment, and every time the height changes the segment has to auto adjust to expand/contract to the new height which doesn't look good. There have been challenges such as when certain texts have scroll elements because they're too long, but trying to scroll up/down to read more will trigger the alternative scroll to show other segments, which I then had to engineer a workaround for.",
        tags: ['scroll', 'animation', 'navigate', 'navigation']
    },
    {
        title: 'Sign In Form',
        description: "The form includes a Sign In, Sign Up, Forget Password, and a Verify Email feature that works using the Resend Email API service. It has an input validation system that only activates when clicked off so it won't annoy the user on every letter typed, and the password requirement isn't very strict as often times just inconveniences users as they can't remember the modified stronger password. Sensitive details are hashed using SHA-256, and JWT is used to validate whether the user is signed in or not via an Access Token and Refresh Token system.",
        tags: ['signin', 'signup', 'forgetpassword', 'verify', 'otp', 'resend', 'email', 'hash', 'sha-256', 'jwt', 'accesstoken', 'refreshtoken']
    },
    {
        title: 'Front-End Hosting',
        description: "All my front-end code is stored in GitHub and hosted via GitHub pages, and it's ran under a custom domain I got off of Namecheap. You can view my public ||GitHub^^https://github.com/pjunhua/personal-site|| if you're interested.",
        tags: ['frontend', 'hosting', 'githubpages', 'domain', 'namecheap']
    },
    {
        title: 'Back-End Hosting',
        description: "My back-end code is hosted via Cloudflare Workers, and its code is mainly for sensitive operations that involve communicating with the database.",
        tags: ['backend', 'hosting', 'cloudflareworkers']
    },
    {
        title: 'Data Storage',
        description: "The data that this website stores are mainly user data, such as when they sign up or send a message. I'm using Neon, which is a serverless PostgreSQL database service.",
        tags: ['database', 'db', 'storage', 'postgresql']
    },
    {
        title: 'Moving Gradient Background',
        description: "Might be a bit too subtle but in the home screen, the background isn't just a static colour but changes along a gradient. I like it as it isn't too distracting but doesn't leave the background too boring like with a static colour.",
        tags: ['background', 'gradient', 'home']
    },
    {
        title: 'About Me Cards',
        description: "In the About Me section, when you click to see next the animation played looks like you're shuffling/cycling through cards. The animation is a mix of z-index manipulation and toggling of classes to apply animations, something I picked up on while building this website.",
        tags: ['animation', 'aboutme']
    },
    {
        title: 'Floating Lights',
        description: "The backdrop of the About Me section has these little orbs floating up. It might look ridiculous/amateurish but the vibe I was going for was fireflies in the night sky, something like a summer festival night like in animes, giving off a chill atmosphere. The lights fade in and fade out smoothly, and appears at random positions. A challenge I had was the lights stacking and not moving up when users clicked off the tab, causing a weird sight when users click back and there's a clump of lights moving up together. To solve this I would stop the generation and clear all lights, only restarting when the user clicks back.",
        tags: ['animation', 'aboutme', 'floatinglights']
    },
    {
        title: 'Infinite Looping Carousel',
        description: "You can find this at the bottom of the My Projects section and is what navigates through the different projects. This was definitely one of, if not the most, difficult component to make in my website. It's easy make the main display of the carousel loop back to the first, but most usually don't include indicators to say how many or which position you're at, and if they do there's a fixed amount. But my goal was to make it so you can drag those controllers and freely spin it while make it have momentum based on how hard you spin. This made it so I couldn't cycle through a fixed set of controllers as it needs to move, so I would need to constantly generate the next item to give that effect. At first I did it with pure HTML and CSS but the dragging was so choppy that trying to free spin it would be impossible. There also weren't many types of this carousel online to reference from so I was on my own. I looked through different options and coincidentally came across framer motion, a part of React that handles animation, that could somewhat accomplish it. They didn't outright have an infinite carousel prepacked, but their drag animation was exactly what I wanted. From there I had to engineer my own solution on top of that drag element to give the effect of an infinite looping carousel.",
        tags: ['infiniteloopingcarousel', 'myprojects', 'framermotion', 'animation']
    },
    {
        title: 'CDN Hosted Videos',
        description: "For the videos in the 'My Projects' section, rather than hosting it myself and causing long load times, I'm using Cloudflare's CDN to cache it.",
        tags: ['cdn', 'hosting', 'cloudflare', 'myprojects']
    },
    {
        title: 'Live Filtering Search Bar',
        description: "This is the search bar in this very page! Whenever you type something, it immediately filters to only show those that are relevant based on the tags. You can also click on a tag to use it as the new search term for convenience.",
        tags: ['filter', 'search', 'websiteinfo', 'tags']
    },
    {
        title: 'Live Chat Message',
        description: "In the 'Contact' section, there's a chat window where we can message each other and it actually works live! It's powered by WebSocket, allowing live updates whenever one of us messages, rather than having to reload or having to ping the database in intervals to check if there's new messages.",
        tags: ['livechat', 'websocket', 'message', 'contact']
    }
]