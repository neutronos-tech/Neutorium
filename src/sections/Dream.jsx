import { lazy, Suspense } from "react";
import { Rise } from "../components/Reveal";
import { Letters } from "../components/Anime";
import { DREAM } from "../data/home";

const Orb = lazy(() => import("../components/Orb"));

// One screen, one thought: the dream, and that there is a way to it.
export default function Dream({ n = "01" }) {
  return (
    <section id="dream" className="living-night relative overflow-hidden text-paper">
      <div className="absolute inset-0" aria-hidden="true">
        <Suspense fallback={null}>
          <Orb />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(31_10_11/0.7)_95%)]" aria-hidden="true" />

      <div className="wrap pointer-events-none relative flex min-h-[100svh] flex-col justify-between py-20 md:py-24">
        <p className="label text-paper/50">Why we do this</p>

        <Letters
          className="text-center text-[clamp(44px,9.4vw,168px)] font-medium leading-[0.9] tracking-[-0.055em]"
          lines={[
            [DREAM.lines[0]],
            [DREAM.lines[1], "font-serif font-normal italic tracking-[-0.02em] text-ember"],
          ]}
        />

        <div className="grid gap-4 md:grid-cols-12 md:items-end">
          <Rise className="max-w-sm text-[15px] leading-relaxed text-paper/70 md:col-span-5">{DREAM.text}</Rise>
          <p className="label hidden text-paper/40 md:col-span-4 md:col-start-9 md:block md:text-right">Move your cursor</p>
        </div>
      </div>
    </section>
  );
}
