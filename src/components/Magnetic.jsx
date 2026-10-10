import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "motion/react";

const MotionLink = motion.create(Link);

export default function Magnetic({ to, children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <MotionLink
      to={to}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ x: sx, y: sy }}
      className="group relative grid h-44 w-44 shrink-0 place-items-center overflow-hidden rounded-full border border-ink bg-ink text-lg text-paper md:h-52 md:w-52"
    >
      <span className="absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-out-expo group-hover:scale-100" />
      <span className="relative transition-colors duration-500 group-hover:text-ink">{children}</span>
    </MotionLink>
  );
}
