import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.container}>
            <h1>Fixtures 360</h1>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2>Replay Stage</h2>
          </div>
        </section>
      
      </main>
    </div>
  );
}
