"use client"
import { useState, useEffect } from "react"

import lessonSequence from "@/data/lesson-sequence"
import { Canvas } from "@react-three/fiber"
import { buildTimeline, getBeatState } from "./timeline"
import { makePassCurve } from "./curves"
import { Line } from "@react-three/drei";



export default function ReplayStage(){

    const [time, setTime] = useState(0)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        // only run a clock while playing. pause = do nothing
        if(!playing) return

        // ID of the next scheduled frame - needed so we can cancel it later
        let frameId = 0;

        // Timestamp (ms) of the previous tick - used to measure "how long since last frame"
        let lastTime = performance.now() //ms

        // Called by the browser right before it paints a frame
        const tick = (now: number) => {
            // real time since last tick, in seconds
            const deltaSeconds = (now - lastTime) / 1000
            lastTime = now;

            // advance the replay playhead by whatever real time just passed (deltaSeconds)
            setTime((current) => {
                const next = current + deltaSeconds;

                // once sequence is finished, stop playing and clamp
                if (next >= 6.42) {
                  setPlaying(false);
                  return 6.42;
                }
                return next;
              });
              
            // keep the loop going: ask for another tick on the next paint   
            frameId = requestAnimationFrame(tick);
        }

        // kick off the first tick
        frameId = requestAnimationFrame(tick)

        // cleanup: runs on pause, or if the effect re-runs, or on unmount
        // without this, an old loop could keep running in the background
        return () => {
            cancelAnimationFrame(frameId)
        } 
    }, [playing]) // Re-run this setup whenever play/pause changes

    // use the timeline
    const timeline = buildTimeline(lessonSequence)
    // get a beat during that timeline
    const state = getBeatState(timeline, time)
    if(!state){
        return;
    }

    // Curve for whatever beat is active (carry / pass / shot).
    // Different actions get different bend amounts.
    const curveHeight =
      state.beat.action === "shot" ? 0.05
      : state.beat.action === "carry" ? 0
      : 0.12;

    const curve = makePassCurve(state.beat.start, state.beat.end, curveHeight)
    const points = curve.getPoints(32) // 33 Vector3s along the path

    console.log(points)

    // Ball rides this beat's curve using eased progress (0 → 1)
    const t = state.easedProgress
    const ballOnCurve = curve.getPoint(t)

    return(
        <div style={{ width: "100%", height: "500px"}}>
            <Canvas
                camera={{ 
                    position: [0, 100, 0],
                    fov: 75,
                    rotation: [-Math.PI / 2, 0, 0]
                 }}
            >
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                 {/* pitch mesh */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[120, 80]} />
                    <meshStandardMaterial color="green" />
                </mesh>

                {/* pass curve */}
                <Line 
                    points={points}
                    color="#f5d300"
                    lineWidth={2}
                    dashed
                    dashSize={1.5}
                    gapSize={1}
                />

                {/* shot START marker mesh */}
                <mesh position={ballOnCurve}>
                    <boxGeometry 
                        args={[5, 5, 5]}
                    />
                    <meshStandardMaterial color="red"/>
                </mesh>
                
                {/* current beat end (on the same curve) */}
                <mesh position={curve.getPoint(1)}>
                    <boxGeometry 
                        args={[5, 5, 5]}
                    />
                    <meshStandardMaterial color="yellow"/>
                </mesh>

            </Canvas>
            <button style={{ width: "50px", height: "50px"}} 
                    onClick={() => {
                        if (!playing && time >= 6.42) {
                          setTime(0);
                        }
                        setPlaying((current) => !current);
                      }}>
                {playing ? "pause" : "play"}                        
            </button>
            <input
                type="range"
                min={0}
                max={6.42}
                step={0.01}
                value={time}
                onChange={(event) => {
                  setTime(Number(event.target.value));
                }}
            />
            <span>{time.toFixed(2)}s</span>              
        </div>
    )
}