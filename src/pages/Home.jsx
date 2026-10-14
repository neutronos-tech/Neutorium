import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import Manifesto from "../sections/Manifesto";
import Partnership from "../sections/Partnership";
import Process from "../sections/Process";
import Contact from "../sections/Contact";
import Rows from "../components/Rows";
import { Lines } from "../components/Reveal";
import Faq from "../components/Faq";
import { useContent } from "../lib/content";

const explore = [
  { title: "About", text: "Who we are, the rules we work by, and why we cap every industry at fifteen partners.", to: "/about" },
  { title: "Research", text: "How every engagement starts: market intelligence, competitor scans and honest baselines.", to: "/research" },
  { title: "Partnership packages", text: "Foundation, Growth and Embedded. The 90-day system and what comes after it.", to: "/partnership" },
  { title: "Services", text: "Web design, development, product design, UX/UI, market research, film, SEO, AEO and AI agents.", to: "/services" },
];

export default function Home() {
  const { faqs } = useContent();
  return (
    <>
      <Hero />
      <Marquee />
      <Manifesto />
      <Partnership n="02" />
      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(03) Explore</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["Everything,", <span className="text-mute">in its place.</span>]}
          />
        </div>
        <div className="md:col-span-7"><Rows items={explore} /></div>
      </section>
      <Process n="04" />
      <section className="wrap grid gap-16 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <p className="label text-mute">(05) Questions</p>
          <Lines
            className="mt-6 text-[clamp(40px,5.6vw,92px)] font-medium leading-[0.95] tracking-[-0.05em]"
            lines={["In short,", <span className="text-mute">what we do.</span>]}
          />
        </div>
        <Faq items={faqs.general} className="md:col-span-7" />
      </section>
      <Contact n="06" />
    </>
  );
}
