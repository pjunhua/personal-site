import ContactChat from '../../components/ContactChat/ContactChat'
import LinkInP from '../../components/LinkInP/LinkInP'
import './Contact.css'

export default function Contact() {
    return (
        <div className='contactContainer'>
            <div className='contactTexts'>
                <h1 className='contactHeader'>Contact Me!</h1>
                <LinkInP textPara={"If there are any feedback, bug reports, or you'd just like to get in touch, contact me via ||p.junhua.business@gmail.com^^mailto:p.junhua.business@gmail.com||.\n\nOr if you have an account on this website, you can simply just send a message in the chat window!"} brighterLink />
            </div>
            <ContactChat />
        </div>
    )
}