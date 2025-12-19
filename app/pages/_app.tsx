import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";

import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

import { HeaderScrollProvider } from "@/context/HeaderScrollContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Store } from "@/config/axiosInstance";
import { setupInterceptors } from "@/config/axiosInstance";
import Snackbar from "@/utilities/Snackbar";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";


const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.25,
      ease: "easeIn" as const,
    },
  },
};



const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

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
          {/* 🔥 ADD THIS */}
          <HeaderScrollProvider>

            <Header />

            {/* Page Transition */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={router.route}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ minHeight: "100vh" }}
              >
                <Component {...pageProps} />
              </motion.main>
            </AnimatePresence>

            <Snackbar />
            <Footer />

          </HeaderScrollProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
