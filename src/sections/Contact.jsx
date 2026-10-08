import { Lines } from "../components/Reveal";
import Magnetic from "../components/Magnetic";

const EMAIL = "hello@neutronos.com"; // replace with your real address

export default function Contact() {
  return (
    <section id="contact" className="wrap py-32 md:py-48">
      <p className="label text-mute">(07) Contact</p>
      <Lines
        className="mt-8 text-[clamp(52px,11vw,200px)] font-medium leading-[0.9] tracking-[-0.06em]"
        lines={["Let's build", <>what's <em className="font-serif font-normal tracking-[-0.02em]">next.</em></>]}
      />
      <div className="mt-16 flex flex-col justify-between gap-10 md:flex-row md:items-center">
        <div>
          <p className="max-w-md leading-relaxed text-ink/60">
            Tell us about your company and your industry. If there's a seat in the current
            cohort, or a single service that fits, we'll reply within two working days.
          </p>
          <a href={"mailto:" + EMAIL} className="nav-link mt-6 inline-block text-lg">{EMAIL}</a>
        </div>
        <Magnetic href={"mailto:" + EMAIL}>Get in touch</Magnetic>
      </div>
    </section>
  );
}
