import { AuthState } from '@/redux/slices/authSlice';
import {
  Sun,
  Moon,
  House,
  CircleUserRound,
} from 'lucide-react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

const menuItems = [
  { text: "Home", href: "/", icon: <House className='icn' />, iconOnly: true },
  { separator: true },
  { text: "About Us", href: "/about/", icon: <CircleUserRound className='icn' /> },
  {
    text: "Projects",
    href: "/projects/",
    icon: <House className='icn' />,
    children: [
      { text: "Live", href: "/projects/live/" },
      { text: "Under Development", href: "/projects/underdev/" },
    ],
  },
  { text: "Blog", href: "/blog/difference-between-tie-beam-and-plinth-beam", icon: <House className='icn' /> },
  { text: "Contact Us", href: "/contact-us/", icon: <House className='icn' /> },
  { text: "FAQ", href: "/faq/", icon: <House className='icn' /> },
  { separator: true },
  { text: "Change Theme" },
];

const sessItems = [
  { text: "Login", href: "/login/" },
  { text: "Sign Up", href: "/signup/" },
];

const Header = () => {
  const [theme, setTheme] = React.useState("light");
  const { isAuthenticated } = useSelector((state: { auth: AuthState }) => state.auth)
  console.log(isAuthenticated);
  const router = useRouter()

  if (isAuthenticated) {
    sessItems.splice(0, sessItems.length, { text: "Login", href: "/login/" })
    sessItems.splice(0, sessItems.length, { text: "Sign Up", href: "/signup/" })
    sessItems.splice(1, sessItems.length, { text: "Logout", href: "/logout/" })
  }

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme whenever changed
  const toggleTheme = () => {
    const updated = theme === "light" ? "dark" : "light";
    setTheme(updated);
    document.documentElement.setAttribute("data-theme", updated);
    localStorage.setItem("theme", updated);
  };

  return (
    <div className='header'>
      <div className='logosec'>MSHIT-Sol</div>
      <div className="navsec">
        <div className="navbar">
          { menuItems?.map((elm, index) =>
            elm?.separator
            ? <span key={index} className='navsep'></span>
            : (
              elm?.href
              ? (
                elm?.iconOnly
                ? <button key={elm?.text} onClick={() => router.push(elm.href)} className='navbtn'>{elm.icon}</button>
                : <Link key={elm?.text} href={elm?.href} className='navlink'>
                  <span style={{ padding: '0.5rem' }}>{elm.icon}</span>
                  <span style={{ padding: '0.5rem' }}>{elm.text}</span>
                </Link>
              )
              : <button key={elm?.text} className='navbtn' onClick={toggleTheme}>
                {theme === "light" ? <Moon className='icn' /> : <Sun className='icn' />}
              </button>
            )
          ) }
        </div>
      </div>
      <div className="sesssec">
        { sessItems?.map(elm => <Link key={elm?.text} href={elm?.href} className='navlink'>{elm?.text}</Link>) }
      </div>
    </div>
  )
}

export default Header