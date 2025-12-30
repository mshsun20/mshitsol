import Head from 'next/head'
import HeaderTrigger from '@/components/layouts/HeaderTrigger'
import AboutPage from '@/components/About/AboutPage'
import AboutHeadPage from '@/components/layouts/HeroSections/AboutHeadPage'

const About = () => {
  return (
    <>
        <Head>
            <title>MSH IT Sol - About | Full Stack Developer Portfolio, MERN, Next.js & DevOps Expert</title>

            <meta
                name="description"
                content="Welcome to MSH IT Sol — Portfolio of a professional Full Stack Developer specializing in MERN Stack, Next.js, DevOps, CI/CD, MongoDB, and scalable cloud deployments."
            />

            <meta name="robots" content="index, follow" />
            <meta name="keywords" content="MSH, IT Solution, Full Stack Developer, MERN Developer, Next.js Developer, Node.js Developer, React Developer, Portfolio, MSH IT Sol, MongoDB, DevOps, CI/CD" />

            <link rel="canonical" href="https://mshitsol-app.vercel.app/about/" />

            {/* OpenGraph */}
            <meta property="og:title" content="MSH IT Sol — Full Stack Developer Portfolio" />
            <meta
            property="og:description"
            content="Explore projects, skills, services, and achievements of a MERN Stack and Next.js Full Stack Developer."
            />
            <meta property="og:site_name" content="MSH IT Sol" />
            <meta property="og:url" content="https://mshitsol-app.vercel.app/about/" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://mshitsol-app.vercel.app/about/og-banner.png" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="MSH IT Sol — Full Stack Developer Portfolio" />
            <meta name="twitter:description" content="Explore the complete portfolio of a Next.js and MERN Stack Developer." />
            <meta name="twitter:image" content="https://mshitsol-app.vercel.app/about/og-banner.png" />

            {/* Schema.org JSON-LD */}
            <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Mriganka Sekhar Halder",
                "jobTitle": "Full Stack Developer",
                "url": "https://mshitsol-app.vercel.app/about/",
                "image": "https://mshitsol-app.vercel.app/logo.png",
                "sameAs": [
                    "https://www.facebook.com/your",
                    "https://www.linkedin.com/company/your"
                ]
                }),
            }}
            />
        </Head>

        <main className="main-body">
            {/* 🔴 OBSERVER TRIGGER */}
            <HeaderTrigger />

            <AboutHeadPage />
            <AboutPage />
        </main>
    </>
  )
}

export default About