import type { ReadyMoment } from "@/data/moments";
import ReplayStage from "@/lib/replay/ReplayStage";
import styles from "@/app/page.module.css";

type ReplayViewProps = {
  moment: ReadyMoment;
};

export default function ReplayView({ moment }: ReplayViewProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <div>
            <h1>{moment.fixture}</h1>
            <p>{moment.description}</p>
          </div>

          <div className={styles.meta}>
            <span>{moment.competition}</span>
          </div>
        </header>

        <section className={styles.pitchSection}>
          <div className={styles.pitchContainer}>
            <ReplayStage
              momentId={moment.id}
              beats={moment.replay.beats}
              freezeFrames={moment.replay.freezeFrames}
            />
          </div>
        </section>
      </main>
    </div>
  );
}