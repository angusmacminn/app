import styles from "./page.module.css";
import ReplayStage from "@/lib/replay/ReplayStage";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1>Fixtures 360</h1>
          <p>
            Spain vs Germany — the 51′ sequence: Yamal carry, cutback, Olmo
            finish. Scrub the clock, switch cameras, explore the freeze frames.
          </p>
          <div className={styles.meta}>
            <span>Euro 2024</span>
            <span>StatsBomb Open Data</span>
            <span>Match 3942226</span>
          </div>
        </header>

        <section className={styles.pitchSection}>
          <h2>Dani Olmo goal sequence</h2>
          <div className={styles.pitchContainer}>
            <ReplayStage />
          </div>
        </section>
      </main>
    </div>
  );
}
