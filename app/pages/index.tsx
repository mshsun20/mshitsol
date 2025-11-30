import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>MSH IT Sol - Home</title>
        <meta name="description" content="This is MSH Portfolio web application of a Full Stack Software Developer." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mshitsol-app.vercel.app/" />

        <meta property="og:title" content="MSH IT Sol — Home" />
        <meta property="og:description" content="Check all the Portfolio details as well as CV" />
        <meta property="og:url" content="https://mshitsol-app.vercel.app/" />
        <meta property="og:type" content="website" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MSH IT Sol",
              "url": "https://mshitsol-app.vercel.app/",
              "logo": "https://mshitsol-app.vercel.app/logo.png",
              "sameAs": ["https://www.facebook.com/your", "https://www.linkedin.com/company/your"]
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
