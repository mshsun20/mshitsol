import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Store } from "@/config/axiosInstance";
import { setupInterceptors } from "@/config/axiosInstance";
import Snackbar from "@/utilities/Snackbar";
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // MUST run on client only
    if (typeof window !== "undefined") {
      setupInterceptors(store as Store);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Header />
          <Component {...pageProps} />
          <Snackbar />
          <Footer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
