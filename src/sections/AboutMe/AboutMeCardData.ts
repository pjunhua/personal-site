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
        bodyText: `Hey there, my name is Jun Hua, and I'll be ${new Date().getFullYear() - 2002} this year. I tend to be pretty reserved and may need time to open up, but I'm the type of guy that'll speak up when needed to.\n\nI enjoy experiencing new things! Since I was 16 I have worked multiple jobs whilst studying, and I always found it thrilling to have the roles reversed from a consumer standpoint, getting to learn what it's like behind-the-scenes and being a part of it. It is also through these jobs that I learnt to be more independent, be less reserved, and work better in a team.\n\nI also enjoy problem solving! From math equations when I was younger, to programming challenges or strategic games in the present.`,
        imagePropsUrl: {
            'topLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tl.png`,
            'topRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-tr.png`,
            'bottomLeft': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-bl.png`,
            'bottomRight': `${process.env.REACT_APP_BASE_CDN_URL}/img/about_me_card/card1/abm1-br.png`
        }
    },
    {
        title: 'My Programming Background',
        bodyText: 'I got my Diploma in Information Technology from Singapore Polytechnic back in 2022. While I have experience with other languages/frameworks like Java and React Native for Mobile App Development, I am the most comfortable with Web Development using JavaScript.\n\nHowever, I am open to learning new things, I even took the initiative to learn React in order to keep my skills updated which were dulled during my 2 years of National Service (NS). Even during my NS, I played around with making Chrome Extensions and programming with Google Sheets to solve actual problems I had in life while refreshing my programming skills.',
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
