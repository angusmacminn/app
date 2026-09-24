import type { ReplayMoment } from "@/data/moments";
import styles from "./MatchSelector.module.css";
import { motion } from "motion/react";

type MatchSelectorProps = {
  moments: readonly ReplayMoment[];
  onSelect: (id: string) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

const brand = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const taglinePanel = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } },
};
const block = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.55, ease } },
};

const redBlock = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.55, ease } },
};

const line = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const content = {
  hidden: {},
  show: { transition: { delayChildren: 0.55, staggerChildren: 0.28 } },
};
const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const row = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const preview = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease } },
};

export default function MatchSelector({
  moments,
  onSelect,
}: MatchSelectorProps) {
  return (
    <div className={styles.page}>
      <main className={styles.selector}>
        <section className={styles.hero} aria-labelledby="selector-title">
        <motion.div
          className={styles.brandPanel}
          aria-hidden="true"
          initial="hidden"
          animate="show"
          variants={brand}
        >
          <motion.span className={styles.redBlock} variants={redBlock} />
          <motion.span className={styles.yellowBlock} variants={block} />
          <motion.p className={styles.brandTitle} variants={line}>
            360
          </motion.p>
        </motion.div>
        <motion.div
          className={styles.taglinePanel}
          initial="hidden"
          animate="show"
          variants={taglinePanel}
        >
          <motion.span className={styles.greenBlock} variants={block} />
          <motion.h1 id="selector-title" className={styles.tagline} variants={line}>
            Data driven
            <br />
            football visualisations
          </motion.h1>
        </motion.div>
        </section>

        <section className={styles.content} aria-label="Available matches">
          <div className={styles.fixtureList}>
            {moments.map((moment) => (
              <button
                className={styles.fixture}
                key={moment.id}
                type="button"
                disabled={moment.status === "coming-soon"}
                onClick={() => onSelect(moment.id)}
              >
                <span className={styles.fixtureName}>{moment.fixture}</span>
                <span className={styles.fixtureStatus}>
                  {moment.status === "ready"
                    ? moment.description
                    : "Coming soon"}
                </span>
              </button>
            ))}
          </div>
          <motion.div 
              className={styles.preview}
              layoutId="replay-frame"
              aria-hidden="true"
          />
        </section>
      </main>
    </div>
  );
}