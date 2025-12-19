import React from "react";
import { HeaderScrollContext } from "@/context/HeaderScrollContext";

const HeaderTrigger = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { setScrolled } = React.useContext(HeaderScrollContext);

  React.useEffect(() => {
    if (!ref.current) return;

    // Reset on mount (important for route change)
    setScrolled(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px 0px 0px", // header height
        threshold: 0,
      }
    );

    observer.observe(ref.current);

    // 🛡 Scroll is ALWAYS the source of truth
    const onScroll = () => {
      if (window.scrollY <= 5) {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [setScrolled]);

  return <div ref={ref} style={{ height: "1px" }} />;
};

export default HeaderTrigger;
