import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const over = (e) => el.classList.toggle("is-hover", !!e.target.closest("a, button"));
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
      raf = requestAnimationFrame(loop);
    };
    addEventListener("mousemove", move);
    addEventListener("mouseover", over);
    loop();
    return () => {
      removeEventListener("mousemove", move);
      removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference">
      <span className="cursor-dot" />
    </div>
  );
}
