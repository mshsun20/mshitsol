import {
    Inter,
    Poppins,
    Dancing_Script,
    Marck_Script,
    Barrio,
    Metamorphous
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
export const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dancing-script', display: 'swap' });
export const marckScript = Marck_Script({ subsets: ['latin'], weight: ['400'], variable: '--font-marck-script', display: 'swap' });
export const barrio = Barrio({ subsets: ['latin'], weight: ['400'], variable: '--font-barrio', display: 'swap' });
export const metamorphous = Metamorphous({ subsets: ['latin'], weight: ['400'], variable: '--font-metamorphous', display: 'swap' });