import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='header'>
        <div className='logosec'>MSHIT-Sol</div>
        <div className="navsec">
            <Link href="/about" className='navlink'>About</Link>
            <Link href="/services" className='navlink'>Services</Link>
            <Link href="/projects" className='navlink'>Projects</Link>
            <Link href="/contact" className='navlink'>Contact</Link>
        </div>
    </div>
  )
}

export default Header