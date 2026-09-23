import type { ReplayMoment } from "@/data/moments";
import styles from "./MatchSelector.module.css";

type MatchSelectorProps = {
  moments: readonly ReplayMoment[];
  onSelect: (id: string) => void;
};

export default function MatchSelector({
  moments,
  onSelect,
}: MatchSelectorProps) {
  return (
    <div className={styles.page}>
      <main className={styles.selector}>
        <section className={styles.hero} aria-labelledby="selector-title">
          <div className={styles.brandPanel} aria-hidden="true">
            <p className={styles.brandTitle}>360</p>
          </div>
          <div className={styles.taglinePanel}>
            <h1 id="selector-title" className={styles.tagline}>
              Data driven
              <br />
              football visualisations
            </h1>
          </div>
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
          <div className={styles.preview} aria-hidden="true" />
        </section>
      </main>
    </div>
  );
}