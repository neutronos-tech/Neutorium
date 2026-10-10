import { useRef } from "react";
import { motion, useInView } from "motion/react";

const ease = [0.16, 1, 0.3, 1];

// Visibility is measured on the heading itself: the masked lines are clipped by
// overflow, so observing them directly never reports them as in view.
export function Lines({ as: Tag = "h2", lines, className = "", delay = 0, play }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.1 });
  const show = play === undefined ? seen : play;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Rise({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
