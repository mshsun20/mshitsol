import React from 'react'
import Link from 'next/link'
import {
    Mail,
    MapPin,
    Github,
} from 'lucide-react';

const tags = [
    { name: 'Email', icon: <Mail />, info: <Link href='mailto:msh.sun20@gmail.com'>msh.sun20@gmail.com</Link> },
    { name: 'Location', icon: <MapPin />, info: 'Remote / Available Worldwide' },
    { name: 'Email', icon: <Github />, info: <Link href='https://github.com/mshsun20' target='_blank'>View Profile</Link> },
]

const ContactPage = () => {
  return (
    <>
        <div className='contact-sec'>
            <div className="contact-main">
                <div className="contact-hdr">Ready to Work Together?</div>
                <div className="contact-desc">{`Whether you have a project in mind or just want to chat about web development, I'd love to hear from you. Let's create something amazing together. Send Me an Email`}</div>
                <div className="contact-btns">
                    {/* <Link>Send me an Email</Link> */}
                    <Link className='btnlnk' href={`/projects/`}>View My Work</Link>
                </div>
                <div className="contact-tags">
                    {
                        tags?.map((elm, i) => (
                            <div className="contact-tag" key={i}>
                                <div className="tag-icon">{elm.icon}</div>
                                <div className="tag-name">{elm.name}</div>
                                <div className="tag-link">{elm.info}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default ContactPage