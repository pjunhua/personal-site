export type aboutMeCard = {
    title: string,
    bodyText: string,
    imagePropsUrl: {
        'topLeft': string,
        'topRight': string,
        'bottomLeft': string,
        'bottomRight': string
    }
}

export const aboutMeArray: aboutMeCard[] = [
    {
        title: 'More About Me',
        bodyText: `Hey there, my name is Jun Hua, and I'll be ${new Date().getFullYear() - 2002} this year. I'm a pretty quiet guy, often keeping to myself, a people observer, if you will.\n\nThat doesn't mean I won't speak up at all though, if it's a close group of friends/colleagues I can turn into a bit of a yappologist, especially if it's a common interest or when I'm teaching someone. In scenarios like work or group assignments where things need to get done, I might even take the initiative.\n\nI also like creating things that are unique to me, probably to a point that's too unhealthy though. 😅 I usually avoid the popular choice, when coding I'd rather use my unoptimised scuffed code over copy-pasting a completed product, even in games I would use an anti-meta option. It's not all bad though, this obsession also led to me making my own website and YouTube channel, which I'm still very proud of!`,
        imagePropsUrl: {
            'topLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tl.png`,
            'topRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tr.png`,
            'bottomLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-bl.png`,
            'bottomRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-br.png`
        }
    },
    {
        title: 'My Work & Education Background',
        bodyText: "For a more detailed coverage, you can visit my LinkedIn ||here^^https://www.linkedin.com/in/poonjunhua/||.\n\nI got my Diploma in Information Technology from 'Singapore Polytechnic (SP)' back in 2022, and before that I graduated from the 'School of Science and Technology, Singapore (SST)', back in 2018.\n\nWhen it comes to programming I feel the most comfortable with the following as they were what I actually used to build this website: HTML, CSS, TypeScript, ReactJS, and PostgreSQL.\n\nWhile pursuing my diploma, I also worked a few part-time/temp jobs as a cashier at retail outlets like Don Don Donki, Gain City, and Cheers, for more than 3 years in total.",
        imagePropsUrl: {
            'topLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card2/abm2-tl.png`,
            'topRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card2/abm2-tr.png`,
            'bottomLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card2/abm2-bl.png`,
            'bottomRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card2/abm2-br.png`
        }
    },
    {
        title: 'My Hobbies',
        bodyText: "During my free time, I enjoy watching various types of videos and playing games. The videos I like watching range from korean variety shows, to anime, to gameplay videos as well.\n\nWhen it comes to video games, I really like strategic card games (Pokemon Pocket/Master Duel), Overwatch, and gacha games. Though I haven't played much of it recently, I also enjoy single-player story games like Yakuza, Fallout, and Mafia, to name a few.\n\nEvery now and then I also play around with photo and video editing. I have the most experience with Photoshop and Filmora, but I also have experience using Vegas & Premiere Pro in the past.",
        imagePropsUrl: {
            'topLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card3/abm3-tl.png`,
            'topRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card3/abm3-tr.png`,
            'bottomLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card3/abm3-bl.png`,
            'bottomRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card3/abm3-br.png`
        }
    }
]
