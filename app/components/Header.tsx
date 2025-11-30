import Link from 'next/link'
import React from 'react'

const menuItems = [
  { text: "Home", href: "/" },
  { text: "About Us", href: "/about/" },
  { text: "Product", href: "/products/" },
  { text: "CSR", href: "/sustainability-csr/" },
  { text: "Media", href: "/brand-marketing-media-coverage/" },
  { text: "Contact Us", href: "/contact-us/" },
  {
    text: "Factories",
    href: "/factories/",
    children: [
      { text: "Jamuria", href: "/factories/jamuria/" },
      { text: "Sambhalpur", href: "/factories/sambhalpur/" },
    ],
  },
  { text: "Quality & Credentials", href: "/quality-testing/" },
  { text: "Projects", href: "/projects/" },
  { text: "Testimonials", href: "/testimonials/" },
  { text: "Blog", href: "/blog/difference-between-tie-beam-and-plinth-beam" },
  { text: "TMT Bars Rate Chart", href: "/tmt-bars-rate-chart/" },
  { text: "FAQ", href: "/faq/" },
];

const Header = () => {
  return (
    <div className='header'>
        <div className='logosec'>MSHIT-Sol</div>
        <div className="navsec">
            {
                menuItems?.map(elm => (
                    <Link key={elm?.text} href={elm?.href} className='navlink'>{elm?.text}</Link>
                ))
            }
        </div>
    </div>
  )
}

export default Header