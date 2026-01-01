import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import emotionCache from "@/utilities/createEmotionCache";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="google-site-verification"
            content="S5gfUIo2NvD0RtbYQMoHnCUrOFKvZTVAjCgVhnlPAUw"
          />
          <link rel="canonical" href="https://mshitsol-app.vercel.app/" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ( ctx: DocumentContext ): Promise<DocumentInitialProps> => {
  const originalRenderPage = ctx.renderPage;
  const { extractCriticalToChunks } = createEmotionServer(emotionCache);

  ctx.renderPage = () => originalRenderPage();

  const initialProps = await Document.getInitialProps(ctx);
  const emotionChunks = extractCriticalToChunks(initialProps.html);

  const emotionStyleElements = emotionChunks.styles.map(
    (style: {
      key: string;
      ids: string[];
      css: string;
    }) => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    )
  );

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleElements,
    ],
  };
};
