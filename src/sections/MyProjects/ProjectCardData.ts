export type projectCard = {
    bannerImageUrl: string,
    video: { url: string, hasAudio: boolean },
    title: string,
    description: string,
    id: number
}

export const projectArray:projectCard[] = [
    {
        bannerImageUrl: `url(${process.env.REACT_APP_BASE_CDN_URL}/img/thumbnail_pcard/thumbnail_pcard_psthumb.png)`,
        video: { url: `${process.env.REACT_APP_BASE_CDN_URL}/video/thumbnails.mp4`, hasAudio: false },
        title: 'Photoshop: Video Thumbnails',
        description: 'Along with video editing, another part of my content creation hobby is creating thumbnails for videos.\n\nI mainly use Photoshop and I have been creating thumbnails for years as seen in the video. I did not have any related studies in this field so it may not be very good, but there are quite a few thumbnails that I am proud of.\n\nThe progress of my thumbnail creation journey can also be seen in the video, the further back it goes, the changes in quality and style are quite evident.',
        id: 0
    }, 
    {
        bannerImageUrl: `url(${process.env.REACT_APP_BASE_CDN_URL}/img/thumbnail_pcard/thumbnail_pcard_custompc.png)`,
        video: { url: `${process.env.REACT_APP_BASE_CDN_URL}/video/neocities.mp4`, hasAudio: false },
        title: "My First Website: LBGz's Custom PC Services",
        description: "I made this for one of my first-year modules in Singapore Polytechnic, and it was my first ever website created since I started learning programming. It is by no means good or functional, but, it's nice to look back on it and see how much has changed since I first started.\n\nYou can visit it yourself by going to ||wryyy.neocities.org^^https://wryyy.neocities.org||.",
        id: 1
    }, 
    {
        bannerImageUrl: `url(${process.env.REACT_APP_BASE_CDN_URL}/img/thumbnail_pcard/thumbnail_pcard_edits.png)`,
        video: { url: `${process.env.REACT_APP_BASE_CDN_URL}/video/shorts_compilation.mp4`, hasAudio: true },
        title: 'Video Editing: YouTube Shorts',
        description: 'As a hobby, I like to make edits of scenes from an anime, in-game, a livestream clip, or sometimes a combination of them.\n\nThese edits were made with Filmora and they are by no means super professional as I have no education background in this field, but I am satisfied with the results!',
        id: 2
    }, 
    {
        bannerImageUrl: `url(${process.env.REACT_APP_BASE_CDN_URL}/img/thumbnail_pcard/thumbnail_pcard_sheets.png)`,
        video: { url: `${process.env.REACT_APP_BASE_CDN_URL}/video/paradestate.mp4`, hasAudio: false },
        title: 'Apps Script: Data Transfer Across Sheets',
        description: "This was a solution I made to an actual issue I faced during my Full-Time National Service. It was my first time hearing of Google Apps Script and decided to take the challenge to learn it.\n\nFor my vocation, I had to work with another unit on a daily basis along with my actual unit. To let our unit know of our status everyday like if we were on leave, MC, or working as per usual, we update our parade state Google Sheet every week. Our partner unit needed to know of our daily statuses as well, but, we couldn't directly share the same parade state Google Sheet as it contained confidential information of other unit personnels' statuses that weren't involved in this unit partnership.\n\nAs such, this solution was made. With this, I could retrieve the parade state of specific relevant personnels to show to our partner unit without leaking the parade state of other personnels. And all of this is done automatically, only requiring us to update the main Google Sheet.",
        id: 3
    }, 
    {
        bannerImageUrl: `url(${process.env.REACT_APP_BASE_CDN_URL}/img/thumbnail_pcard/thumbnail_pcard_saver.png)`,
        video: { url: `${process.env.REACT_APP_BASE_CDN_URL}/video/timestampsaverpromo.mp4`, hasAudio: true },
        title: "Chrome Extension: JunHua's YT Timestamp Saver",
        description: "As a disclaimer, YouTube has since made it so when you return to the same video after having watched it before, it'll resume playing from where you left off. However, you need to be logged into an account, else the video will start from the beginning.\n\nWhen I made this extension it was before this update, and whenever I watched videos that were hours long, I remember having to write down the timestamp of where I stopped so I could continue later.\n\nThat's when I decided to take things into my own hand and challenged myself to make a solution with my programming knowledge. This was my first time learning the 'Chrome for Developers' API to create a Chrome Extension. The actual extension is very simple, with a click of the icon, the video timestamp is extracted and injected it into the URL, but it is with that simple click that made my life back then a lot easier which is one of the reasons why I enjoy programming so much.",
        id: 4
    }
];
