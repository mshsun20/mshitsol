import React from "react";

export const HeaderScrollContext = React.createContext({
    scrolled: false,
    setScrolled: (_: boolean) => {}
});

export const HeaderScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const [scrolled, setScrolled] = React.useState(false);

    return (
        <HeaderScrollContext.Provider value={{ scrolled, setScrolled }}>
            {children}
        </HeaderScrollContext.Provider>
    );
};
