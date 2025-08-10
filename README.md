# JunHua's Personal Website

**Welcome to my personal website's GitHub!**

You can visit the website by going to https://poonjunhua.com where you can learn more about me and get in touch!

![homepage_screenshot](https://cdn.poonjunhua.com/img/homepage_ss.png)

## More About Me

Hey! 👋 My name is **Jun Hua**, and I'm a Web Developer based in Singapore. I have a **Diploma in Information Technology** from **Singapore Polytechnic**, and programming is one of my hobbies! 

Rather than waiting for a solution to be made, I like how my knowledge of programming gives me the option to just build it myself. The freedom to design it to my liking, and the ability to bring my ideas to life, is what I like so much about programming!

You can also visit my [LinkedIn](https://www.linkedin.com/in/poonjunhua) to learn more about me.

## Why Did I Make This Website?


### Reason 1: Professional Showcase

What better way to showcase what I'm capable of then sharing a website I made myself? It's also convenient as it's a live website that can be viewed anytime, anywhere, rather than waiting to make it to an interview to share.

There's also a section in the website that shows my past projects with a short video demonstration, allowing me to better present my portfolio.


### Reason 2: To Fulfill A Long Time Dream

Back in Secondary School when I started to consume technology more often, I started to gain interest in having my own website.

Not a lot of people can say they have their own website, and I think it's kind of cool to have one to show to friends, acquaintances, or new people you're meeting. Being able to customise it however I want, be it design choice or features, also makes it super fun and unique.

I remember trying out Wix back when I was a secondary school student and had no programming knowledge, never thought I would one day be able to make this small dream of mine come true.

## What's In The Website?

This website is all about me! You can learn more about my personality, my past works, my hobbies, and even contact me. I'm a big fan of fullscreen designs for websites, so instead of a long scroll website with a consistent design, I created multiple sections, each with their own design concept that's meant to be experienced one at a time fullscreen.

The website is made with the following tech stacks and services: HTML, CSS, NodeJS, ReactJS, Framer Motion, GitHub Pages (Front-End Hosting), Cloudflare Workers (Back-End Hosting) & Durable Object (for WebSocket), Neon (PostgreSql Database), and Resend (Email API).

One of the key things I felt was importatnt to focus on while making this website, was making it responsive and look good even on mobile. While researching different portfolio websites or professional company websites, they looked fine on desktop but on mobile, the UI would be all over the place, looking awful, or sometimes the whole website just doesn't work at all. I think on this point I did quite well, I really like how my mobile experience turned out.

I actually struggled a bit with mobile browsers messing with view heights whenever the address bar hides when scrolling. Especially since this website's is meant to be a full screen experience rather than a standard scroll, so having the view heights constantly changing made it super janky. Had to override how scrolling functioned entirely on the site to ensure the view height stays consistent to maintain the viewing experience.

I'll go through each section and what are some of the features/designs in them.

### Homepage

Right away you are graced by my wonderful portrait, think it's always nice to be able to put a face to the name and a fitting center piece to fill up the whitespace.

The background is a simple moving gradient so it isn't too distracting, but not too plain as well, like it would be with a static colour.

There's also a textbox that appears at the bottom of the screen with a neat little typing animation, I even made it pause a bit for punctuations to make it flow like actual talk. Those that have played story based games are proabably familiar with it, and you can actually interact with it. By default if you're not logged in, the first message is a simple greeting which also let's you know you can scroll to navigate and see more, just in case some people might think it's only the homepage and that's it due to the fullscreen design.

When a message is being typed out, you can click on it to skip to the end if you don't want to wait for the full message to finish typing. Once a message is fully typed out, clicking on it will start displaying a new message based on the current time! Each time frame has 4 greeting variations and I actually made it a bit of a gacha where 2 of the messages have lower odds to appear, but a same message will never be displayed twice in a row.

### About Me

For the background I wanted to go for a fireflies in the night sky vibe, chill and cozy without being too distracting.

I split the About Me section into 3 cards, 'More About Me', 'My Programming Background', and 'My Hobbies'. While I do want my website to be a portfolio of sorts to companies, first and foremost I want a website that is about **me**, something I can also show others in a non-professional setting where they can learn something new about me. I don't like the idea of making my 'About Me' be overly formal and rigid, only talking about things like, what are my tech stacks, my job experience, or my education level.

As for the design of the 3 cards, I don't know why but the idea of making them like those little presentation cards you use to write your script/prompts got stuck in my head. The animation is the front card being shuffled to the back, kind of like how you would cycle through them during a speech. I think it kind of turned out nicely, though it may be a bit bland. To kind of compensate for that blandness, for each card I also have little photos at each corner that gives you a visual representation of what's being talked about in the card itself.

### My Projects

This is my favorite section of the website, as well as the one that was the toughest to code, and the most likely to have bugs. In this section I'm displaying not only my coding projects, but a bit of my hobby as well.

These projects are displayed in the style of a nice and large fullscreen video display of the project, and a carousel at the bottom that controls which project is being displayed. But it's not just any carousel, but one that you can drag **AND** flick to let it rip, infinitely generating the next project in the direction it's moving. It also has physics, so it'll gradually slow down by itself before snapping to the closest project card.

Ever since I started ideating for this section, I really wanted this feature, especially the infinite spinning part of the carousel. Is it a practical feature that people who want to browse through would use? Of course not. But that's the beauty of being able to code my own website, I can add whatever feature I want and make it a reality. 

However, that also came with the responsibility of creating it from scratch, which was tough considering there weren't many examples out there I could take reference from. I tried with pure HTML/CSS/JavaScript and it was so janky and awful. That's when I came across FramerMotion. While it did not have a pre-built carousel, it did have the ability to make a div draggable and have physics like inertia slowing it down after a while. Then with my 200 IQ genius galaxy mind, I made use of that as a base to eventually make the final product as you can see in the website.

### Website Info

I wanted to dedicate a section to talking about the features in the website, such as a short description about it, as well as the services/tech I used to make it. This section is probably only relevant for the professional viewers of the site, or those that are knowledgeable in this field. However, it's also meant to be a way to highlight features that others might have missed, even if they don't understand all the tech jargon.

For the design of this section I really wanted to have a live search bar, where based on what you've typed so far, it'll automatically filter without needing to click on a search button or press enter. I like this design because it saves you a lot of time as it gives you immediate feedback to know if what you're looking for exists so you can move on quicker. The actual bits of info are organised in collapsed cards so you can quickly view all of them, and only if you're interested, you can click on it to expand and learn more about it.

The background is meant to give a sunset vibe, with that warm calming tone and the contrasting sun. I had to add an overlay that darkened the backdrop as my sun was a bit too effective at being bright, making it quite distracting and hard to read the text, but it ended up looking a lot nicer and calming with that overlay. There are also cloud-like objects that are floating across the sun, though it may be quite hard to spot with the info cards covering it, and especially with the dark overlay. But, I think it still contributes to the atmosphere and keep things from looking too static and plain.

I also added a different transition to move to the next section. Rather than the normal slide up and down, it instead rotates to reveal in order to give that sun setting kind of vibe.

### Contact

The backdrop continues the theme of Website Info's section, from a sunset rotating to set comes a night backdrop with a bright moon in place of the sun earlier. It also has the same overlay and floating clouds that are more visible thanks to the white contrast of the moon.

As for the actual feature of this section, I made my own messaging system that works live with websocket, meaning if one party sends a message, the other receives it immediately without needing to trigger a refresh. This was another cool thing to learn and make, getting to know how the messaging apps we use everyday functions and actually creating a working one of my own is neat.