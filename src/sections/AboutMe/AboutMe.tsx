import { useState } from 'react';
import AboutMeCard from '../../components/AboutMeCard/AboutMeCard';
import FloatingLights from '../../components/FloatingLights/FloatingLights';

export default function AboutMe() {

    const [zIndexes, setZIndexes] = useState<number[]>([23, 22, 21]);

    const updateZIndexes = (currentIndex: number) => {
        if (zIndexes[currentIndex] === Math.max(...zIndexes)) {
            const newArray = [...zIndexes];
            const poppedNumber = newArray.pop();

            if (poppedNumber) {
                newArray.unshift(poppedNumber);
                setZIndexes(newArray);
            }
        }
    }

    const card1 = {
        title: 'More About Me',
        bodyText: `Hey there, my name is Jun Hua, and I'll be ${new Date().getFullYear() - 2002} this year. I tend to be pretty reserved and may need time to open up, but I'm the type of guy that'll speak up when needed to.\n\nI enjoy experiencing new things! Since I was 16 I have worked multiple jobs whilst studying, and I always found it thrilling to have the roles reversed from a consumer standpoint, getting to learn what it's like behind-the-scenes and being a part of it. It is also through these jobs that I learnt to be more independent, be less reserved, and work better in a team.\n\nI also enjoy problem solving! From math equations when I was younger, to programming challenges or strategic games in the present.`,
        index: 0,
        imagePropsUrl: {
            'topLeft': '/img/card1/abm1-tl.png',
            'topRight': '/img/card1/abm1-tr.png',
            'bottomLeft': '/img/card1/abm1-bl.png',
            'bottomRight': '/img/card1/abm1-br.png'
        }
    }

    const card2 = {
        title: 'My Programming Background',
        bodyText: 'I got my Diploma in Information Technology from Singapore Polytechnic back in 2022. While I have experience with other languages/frameworks like Java and React Native for Mobile App Development, I am the most comfortable with Web Development using JavaScript.\n\nHowever, I am open to learning new things, I even took the initiative to learn React in order to keep my skills updated which were dulled during my 2 years of National Service (NS). Even during my NS, I played around with making Chrome Extensions and programming with Google Sheets to solve actual problems I had in life while refreshing my programming skills.',
        index: 1,
        imagePropsUrl: {
            'topLeft': '/img/card2/abm2-tl.png',
            'topRight': '/img/card2/abm2-tr.png',
            'bottomLeft': '/img/card2/abm2-bl.png',
            'bottomRight': '/img/card2/abm2-br.png'
        }
    }

    const card3 = {
        title: 'My Hobbies',
        bodyText: "During my free time, I enjoy watching various types of videos and playing games. The videos I like watching range from korean variety shows, to anime, to gameplay videos as well.\n\nWhen it comes to video games, I really like strategic card games (Pokemon Pocket/Master Duel), Overwatch, and gacha games. Though I haven't played much of it recently, I also enjoy single-player story games like Yakuza, Fallout, and Mafia, to name a few.\n\nEvery now and then I also play around with photo and video editing. I have the most experience with Photoshop and Filmora, but I also have experience using Vegas & Premiere Pro in the past.",
        index: 2,
        imagePropsUrl: {
            'topLeft': '/img/card3/abm3-tl.png',
            'topRight': '/img/card3/abm3-tr.png',
            'bottomLeft': '/img/card3/abm3-bl.png',
            'bottomRight': '/img/card3/abm3-br.png'
        }
    }

    return (
        <>
            <FloatingLights />
            <AboutMeCard title={card1.title} nextTitle={card2.title} bodyText={card1.bodyText} zIndexObject={{ index: card1.index, array: zIndexes, zIndex: zIndexes[card1.index] }} imagePropsUrl={card1.imagePropsUrl} updateZIndex={(currentIndex: number) => { updateZIndexes(currentIndex) }} />
            <AboutMeCard title={card2.title} nextTitle={card3.title} bodyText={card2.bodyText} zIndexObject={{ index: card2.index, array: zIndexes, zIndex: zIndexes[card2.index] }} imagePropsUrl={card2.imagePropsUrl} updateZIndex={(currentIndex: number) => { updateZIndexes(currentIndex) }} />
            <AboutMeCard title={card3.title} nextTitle={card1.title} bodyText={card3.bodyText} zIndexObject={{ index: card3.index, array: zIndexes, zIndex: zIndexes[card3.index] }} imagePropsUrl={card3.imagePropsUrl} updateZIndex={(currentIndex: number) => { updateZIndexes(currentIndex) }} />
        </>
    )
}