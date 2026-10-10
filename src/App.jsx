import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { startLenis, stopScroll, resetScroll, scrollTo, ScrollTrigger } from "./lib/smooth";
import { ReadyContext } from "./lib/ready";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Research from "./pages/Research";
import Partnership from "./pages/Partnership";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Start from "./pages/Start";
import NotFound from "./pages/NotFound";

const TITLES = {
  "/": "Neutorium · Research & Partnership",
  "/about": "About · Neutorium",
  "/research": "Research · Neutorium",
  "/partnership": "Partnership · Neutorium",
  "/services": "Services · Neutorium",
  "/start": "Start a project · Neutorium",
};

export default function App() {
  const { pathname, hash } = useLocation();
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  const first = useRef(true);

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

  // New page: start at the top, re-measure scroll triggers, then honour any #hash.
  useLayoutEffect(() => {
    document.title = TITLES[pathname] || "Neutorium";
    if (!first.current) resetScroll();
    first.current = false;
    const t = setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!hash || !ready) return;
    const t = setTimeout(() => scrollTo(hash), 300);
    return () => clearTimeout(t);
  }, [hash, pathname, ready]);

  return (
    <ReadyContext.Provider value={ready}>
      <Loader onDone={done} />
      <Cursor />
      <Nav />
      <main key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/start" element={<Start />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {pathname !== "/start" && <Footer />}
    </ReadyContext.Provider>
  );
}
