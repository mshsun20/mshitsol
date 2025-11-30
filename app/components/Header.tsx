import Link from 'next/link'
import React from 'react'

const menuItems = [
  { text: "Home", href: "/" },
  { text: "About Us", href: "/about/" },
  {
    text: "Projects",
    href: "/projects/",
    children: [
      { text: "Live", href: "/projects/live/" },
      { text: "Under Development", href: "/projects/underdev/" },
    ],
  },
  { text: "Testimonials", href: "/testimonials/" },
  { text: "Blog", href: "/blog/difference-between-tie-beam-and-plinth-beam" },
  { text: "Contact Us", href: "/contact-us/" },
  { text: "FAQ", href: "/faq/" },
];

const Header = () => {
  return (
    <div className='header'>
        <div className='logosec'>MSHIT-Sol</div>
        <div className="navsec">
            { menuItems?.map(elm => <Link key={elm?.text} href={elm?.href} className='navlink'>{elm?.text}</Link>) }
        </div>
    </div>
  )
}

export default Header