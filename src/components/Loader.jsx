import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";

export default function Loader({ onDone }) {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const c = animate(0, 100, {
      duration: 1.3,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(() => setShow(false), 150),
    });
    return () => c.stop();
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-between bg-ink p-6 text-paper md:p-10"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="label text-paper/60">Neutronos</span>
          <span className="text-[22vw] font-light leading-none tracking-[-0.06em] tabular-nums md:text-[12vw]">
            {n}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
