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
        <title>MSH IT Solutions</title>
      </Head>
      <div
        className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
      >
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div>Home</div>
        </main>
      </div>
    </div>
  );
}
