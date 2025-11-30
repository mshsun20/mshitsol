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
        <title>MSHITSol - Home</title>
        <meta name="description" content="This is MSH Portfolio web application of a Full Stack Software Developer." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mshitsol-app.vercel.app/" />
        <meta property="og:title" content="Full Stack Software Developer Profile | MSH IT Sol" ></meta>
        <meta property="og:description" content="Check all the Portfolio details as well as CV for your reference." ></meta>
        <meta property="og:url" content="https://mshitsol-app.vercel.app/" ></meta>
      </Head>
      <div className="main-body">
        <main>
          <div>Home</div>
        </main>
      </div>
    </div>
  );
}
