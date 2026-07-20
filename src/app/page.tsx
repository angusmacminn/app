import Image from "next/image";
import styles from "./page.module.css";
import lessonSequence from "@/data/lesson-sequence";

export default function Home() {

  // extract only passes
  const passes = lessonSequence.filter((item) => item.action === 'pass');
  // console.log(passes);

  // create pass labels for each pass
  const passLabels = passes.map((pass) => {
    return (
      `${pass.player} -> ${pass.recipient}`
    )
  })
  // console.log(passLabels)

  // use reduce to get the total duration of the beat
  const totalDuration = lessonSequence.reduce((total, action) => {
    return total + action.duration }, 0)
  // console.log(totalDuration)

  // extract only shots
  const shot = lessonSequence.filter((item) => item.action === 'shot')
  // console.log(shot)

  // calculate shot distance by iterating over shots, and for each take the start/end coords and use pythagorean formula
  const shotDistance = shot.map((shot) => {
    const dx = shot.end[0] - shot.start[0]
    const dy = shot.end[1] - shot.start[1]

    return Math.hypot(dx, dy);
  })

  // console.log(shotDistance)


  // visual actions
  const visualActions = lessonSequence
      .filter((item) => item.action === 'shot')
      .map((shot) => {
        const dx = shot.end[0] - shot.start[0]
        const dy = shot.end[1] - shot.start[1]
        const distance = Math.hypot(dx, dy)
        
        return {
          ...shot,
          distance,
          curveHeight: distance * 1.5
        }
      })

      console.log(visualActions)


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.hero}>
            <h1>Fixtures 360</h1>
          </div>
          <h2>Replay Stage</h2>
          <div className={styles.container}>
            {
              visualActions.map((shot) => {
                const [dataStartX, dataStartY] = shot.start;
                const [dataEndX, dataEndY] = shot.end;
                const scale = 1;

                const startX = dataStartX * scale;
                const startY = dataStartY * scale;
                const endX = dataEndX * scale;
                const endY = dataEndY * scale;

                const controlX = (startX + endX) / 2;
                const controlY = (startY + endY) / 2 - shot.curveHeight;

                return(
                  <svg key={shot.id} viewBox="0 0 200 100">
                    <path
                    d={`M ${startX} ${startY} 
                        Q ${controlX} ${controlY} 
                        ${endX} ${endY}`}
                    fill="none"
                    stroke="red"
                    />
                  </svg>
                )
                
              })
            }
            
          </div>
        </section>

        <section className={styles.section}>
          
        </section>
      
      </main>
    </div>
  );
}
