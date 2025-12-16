import { AuthState } from '@/redux/slices/authSlice';
import {
  Sun,
  Moon,
  House,
  CircleUserRound,
  UserPlus,
  UserCheck,
  UserX
} from 'lucide-react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { useSelector } from 'react-redux';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

const menuItems = [
  { text: "Home", href: "/", iconOnly: true },
  { separator: true },
  { text: "About Us", href: "/about/", icon: <CircleUserRound className='icn' /> },
  {
    text: "Projects",
    href: "/projects/",
    icon: <House className='icn' />,
    children: [
      { text: "Live", href: "/projects/live/" },
      { text: "Under Development", href: "/projects/dev/" },
    ],
  },
  { text: "Blog", href: "/blog/difference-between-tie-beam-and-plinth-beam", icon: <House className='icn' /> },
  { text: "Contact Us", href: "/contact-us/", icon: <House className='icn' /> },
  { text: "FAQ", href: "/faq/", icon: <House className='icn' /> },
  { separator: true },
  { text: "Change Theme" },
];

const sessItems = [
  { text: "Sign Up", href: "/signup/", icon: <UserPlus className='icn' /> },
  { text: "Login", href: "/login/", icon: <UserCheck className='icn' /> },
];

const Header = () => {
  const [theme, setTheme] = React.useState("light");
  const { isAuthenticated } = useSelector((state: { auth: AuthState }) => state.auth)
  // console.log(isAuthenticated);
  const router = useRouter(); // Pages router
  const currentPath = router?.asPath || '/';
  const [scrolled, setScrolled] = React.useState(false)

  // Adjust sessItems if authenticated---------------------
  if (isAuthenticated) {
    sessItems.splice(0, sessItems.length, { text: "Sign Up", href: "/signup/", icon: <UserPlus className='icn' /> })
    sessItems.splice(0, sessItems.length, { text: "Login", href: "/login/", icon: <UserCheck className='icn' /> })
    sessItems.splice(1, sessItems.length, { text: "Logout", href: "/logout/", icon: <UserX className='icn' /> })
  }

  // Theme handler---------------------
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

  // On Scroll style changes
  React.useEffect(() => {
    const target = document.querySelector('.main-body')
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0.1 })
    observer.observe(target)

    return () => observer.disconnect()
  }, [])


  // Active Link configuration---------------------
  // Normalizes paths: strips query/hash and trailing slash (but keeps "/" as "/")
  const normalize = (p: string) => {
    if (!p) return '/';
    const cleaned = p.split(/[?#]/)[0]; // remove query/hash
    if (cleaned === '/') return '/';
    return cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
  };
  // returns true when link should be considered active
  const isActive = (href: string) => {
    const cur = normalize(currentPath);
    const tgt = normalize(href);

    if (tgt === '/') return cur === '/';
    // active if exact match OR current path is inside the target path (e.g. /projects/live -> /projects)
    return cur === tgt || cur.startsWith(tgt + '/');
  };
  // Adjust session items if authentication state changes (avoid mutating original array)
  const sessionLinks = React.useMemo(() => {
    if (isAuthenticated) {
      return [{ text: "Logout", href: "/logout/", icon: <UserX className='icn' /> }];
    }
    return sessItems;
  }, [isAuthenticated]);


  return (
    <div className={`header ${dancingScript}`}>
      <div className='logosec'>
        <Link href="/" className='logo'>MSHIT-Sol</Link>
      </div>
      <div className="navsec">
        {menuItems.map((elm, index) =>
          elm?.separator ? (
            <span key={index} className='navsep'></span>
          ) : elm?.href ? (
            elm?.iconOnly ? (
              <Link
                key={elm.text}
                href={elm.href}
                title={elm.text}
                className={`navbtn ${isActive(elm.href) ? 'active' : ''}`}
              >
                <span><House className='icn' /></span>
              </Link>
            ) : (
              <Link
                key={elm.text}
                href={elm.href}
                title={elm.text}
                className={`navlink ${isActive(elm.href) ? 'active' : ''}`}
              >
                <span style={{ padding: '0.5rem' }}>{elm.icon}</span>
                <span style={{ padding: '0.5rem' }}>{elm.text}</span>
              </Link>
            )
          ) : (
            <button
              key={elm.text}
              title={elm.text}
              className='navbtn'
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className='icn' /> : <Sun className='icn' />}
            </button>
          )
        )}
      </div>

      <div className="sesssec">
        {sessionLinks.map(elm =>
          <Link
            key={elm.text}
            href={elm.href}
            title={elm.text}
            className={`navlink ${isActive(elm.href) ? 'active' : ''}`}
          >
            {elm?.icon && <span style={{ padding: '0.5rem' }}>{elm.icon}</span>}
            <span style={{ padding: '0.5rem' }}>{elm.text}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header