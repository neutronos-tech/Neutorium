import Hero from "../sections/Hero";
import Dream from "../sections/Dream";
import Areas from "../sections/Areas";
import Challenges from "../sections/Challenges";
import Approach, { Matcher } from "../sections/Approach";
import Capabilities from "../sections/Capabilities";
import Engage, { Choice, StartSmall } from "../sections/Engage";
import Contact from "../sections/Contact";
import { Lines } from "../components/Reveal";
import Faq from "../components/Faq";
import { useContent } from "../lib/content";
import { h2 } from "../lib/type";

// The home page stays easy: the dream, proof it is reachable, why it is hard alone, how we
// help, and a small first step. The depth lives on the industry and service pages.
export default function Home() {
  const { faqs } = useContent();
  return (
    <>
      <Hero />
      <Dream />
      <Areas />
      <Challenges />
      <Approach />
      <Capabilities />
      <Matcher />
      <Engage />
      <Choice />
      <StartSmall />
      <section className="wrap grid gap-16 border-t border-line py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-5">
          <p className="label text-mute">Questions</p>
          <Lines className={h2} lines={["In short,", <span className="text-mute">what we do.</span>]} />
        </div>
        <Faq items={faqs.general} className="md:col-span-7" />
      </section>
      <Contact />
    </>
  );
}
