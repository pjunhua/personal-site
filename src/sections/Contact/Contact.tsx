import ContactChat from '../../components/ContactChat/ContactChat'
import './Contact.css'

export default function Contact() {
    return (
        <div className='contactContainer'>
            <div className='contactTexts'>
                <h1 className='contactHeader'>Contact Me!</h1>
                <p>If there are any feedback, bug reports, or you'd just like to get in touch, contact me via <a href="mailto:p.junhua.business@gmail.com">p.junhua.business@gmail.com</a>.<br /><br />Or if you have an account on this website, you can simply just send a message in the chat window!</p>
            </div>
            <ContactChat />
        </div>
    )
}