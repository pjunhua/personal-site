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
        bodyText: `Hey there, my name is Jun Hua, and I'll be ${new Date().getFullYear() - 2002} this year.\n\nI'm known to be a quiet and stoic guy on the surface, but I open up fairly quickly and can even get quite talkative on topics of interest.\n\nI enjoy creating my own solutions for problems, like with my coding projects, as well as making my own content. I also find fulfilment in teaching others be it a new hire or a fellow student.`,
        imagePropsUrl: {
            'topLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tl.png`,
            'topRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tr.png`,
            'bottomLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-bl.png`,
            'bottomRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-br.png`
        }
    },
    {
        title: 'My Work & Education Background',
        bodyText: "For a more detailed coverage, you can visit my LinkedIn ||here^^https://www.linkedin.com/in/poonjunhua/||.\n\nI got my Diploma in Information Technology from 'Singapore Polytechnic (SP)' back in 2022, and before that I graduated from the 'School of Science and Technology, Singapore (SST)', back in 2018.\n\nWhen it comes to programming I feel the most comfortable with the following as they were what I actually used to build this website: HTML, CSS, TypeScript, ReactJS, and PostgreSQL.\n\nWhile pursuing my diploma, I have also worked a few part-time/temporary cashier jobs.",
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
