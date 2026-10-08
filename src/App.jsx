import { useEffect, useState } from "react";
import { startLenis, stopScroll, ScrollTrigger } from "./lib/smooth";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Manifesto from "./sections/Manifesto";
import Research from "./sections/Research";
import Partnership from "./sections/Partnership";
import Packages from "./sections/Packages";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const stop = startLenis();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => stop?.();
  }, []);

  useEffect(() => {
    stopScroll(!ready);
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Manifesto />
        <Research />
        <Partnership />
        <Packages />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
