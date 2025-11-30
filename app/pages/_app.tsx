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

import { Sun, Moon } from "lucide-react";

function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    // MUST run on client only
    if (typeof window !== "undefined") {
      setupInterceptors(store as Store);
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme whenever changed
  const toggleTheme = () => {
    const updated = theme === "light" ? "dark" : "light";
    setTheme(updated);
    document.documentElement.setAttribute("data-theme", updated);
    localStorage.setItem("theme", updated);
  };

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
    {/* You can place toggle button in Navbar or globally */}
    <button
      onClick={toggleTheme}
      className="theme-toggle-button"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
    </>
  );
}

export default App;
