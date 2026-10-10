import { Link } from "react-router-dom";
import { Arrow } from "./Icons";

// Numbered rows that fill with ink on hover (the original research-list pattern).
export default function Rows({ items }) {
  return (
    <ul>
      {items.map(({ title, text, to }, i) => {
        const inner = (
          <>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
            <div className="relative grid grid-cols-[2.5rem_1fr_auto] gap-4 px-1 py-8 transition-colors duration-500 group-hover:text-paper md:px-4 md:py-10">
              <span className="pt-2 font-mono text-xs text-mute transition-colors duration-500 group-hover:text-paper/60">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl tracking-[-0.03em] md:text-4xl">{title}</h3>
                {text && <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-paper/70">{text}</p>}
              </div>
              <Arrow className="mt-2 h-5 w-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
            </div>
          </>
        );
        return (
          <li key={title} className="group relative overflow-hidden border-t border-line last:border-b">
            {to ? <Link to={to} className="block">{inner}</Link> : inner}
          </li>
        );
      })}
    </ul>
  );
}
