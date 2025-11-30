import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/Header";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-site-verification" content="S5gfUIo2NvD0RtbYQMoHnCUrOFKvZTVAjCgVhnlPAUw" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
