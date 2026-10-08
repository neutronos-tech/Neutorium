import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1];

export function Lines({ as: Tag = "h2", lines, className = "", delay = 0, play }) {
  const trigger =
    play === undefined
      ? { whileInView: { y: "0%" }, viewport: { once: true, margin: "-10% 0px" } }
      : { animate: play ? { y: "0%" } : undefined };

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            {...trigger}
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
