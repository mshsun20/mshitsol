import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function Home() {
  return (
    <div>
      <Head>
        <title>MSH IT Sol - Home | Full Stack Developer Portfolio, MERN, Next.js & DevOps Expert</title>

        <meta
          name="description"
          content="Welcome to MSH IT Sol — Portfolio of a professional Full Stack Developer specializing in MERN Stack, Next.js, DevOps, CI/CD, MongoDB, and scalable cloud deployments."
        />

        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="MSH, IT Solution, Full Stack Developer, MERN Developer, Next.js Developer, Node.js Developer, React Developer, Portfolio, MSH IT Sol, MongoDB, DevOps, CI/CD" />

        <link rel="canonical" href="https://mshitsol-app.vercel.app/" />

        {/* OpenGraph */}
        <meta property="og:title" content="MSH IT Sol — Full Stack Developer Portfolio" />
        <meta
          property="og:description"
          content="Explore projects, skills, services, and achievements of a MERN Stack and Next.js Full Stack Developer."
        />
        <meta property="og:site_name" content="MSH IT Sol" />
        <meta property="og:url" content="https://mshitsol-app.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mshitsol-app.vercel.app/og-banner.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MSH IT Sol — Full Stack Developer Portfolio" />
        <meta name="twitter:description" content="Explore the complete portfolio of a Next.js and MERN Stack Developer." />
        <meta name="twitter:image" content="https://mshitsol-app.vercel.app/og-banner.png" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mriganka Sekhar Halder",
              "jobTitle": "Full Stack Developer",
              "url": "https://mshitsol-app.vercel.app/",
              "image": "https://mshitsol-app.vercel.app/logo.png",
              "sameAs": [
                "https://www.facebook.com/your",
                "https://www.linkedin.com/company/your"
              ]
            }),
          }}
        />
      </Head>

      <div className="main-body">
        <main>
          <div>Home</div>
        </main>
      </div>
    </div>
  );
}
