import styles from "./page.module.css";
import ReplayStage from "@/lib/replay/ReplayStage";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <div>
            <h1>Spain vs Germany</h1>
            <p>Goal — Dani Olmo, 51′</p>
          </div>
          <div className={styles.meta}>
            <span>Euro 2024</span>
            {/* <span>StatsBomb 360</span> */}
            {/* <span>Match 3942226</span> */}
          </div>
        </header>

        <section className={styles.pitchSection}>
          <div className={styles.sectionHeader}>
            {/* <span>Scrub / Camera / Freeze Frames</span> */}
          </div>
          <div className={styles.pitchContainer}>
            <ReplayStage />
          </div>
        </section>
      </main>
    </div>
  );
}
