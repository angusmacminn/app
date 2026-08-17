"use client";
import { useState, useEffect } from "react";
import * as THREE from "three";

import lessonSequence, { lessonFreezeFrames } from "@/data/lesson-sequence";
import { Canvas } from "@react-three/fiber";
import { buildTimeline, getBeatState } from "./timeline";
import { makePassCurve } from "./curves";
import { OrbitControls } from "@react-three/drei";
import Transport from "./transport";
import Pitch from "./Pitch";
import BallTrail from "./BallTrail";
import CameraRig from "./CameraRig";
import { getFreezeFrame } from "./freezeframe";
import PlayerMarkers from "./PlayerMarkers";
import styles from "./ReplayStage.module.css";

type CameraMode = "follow" | "tactical" | "orbit";

export default function ReplayStage() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("follow");


  // pause when tab not active (event name must be all-lowercase)
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Clock
  useEffect(() => {
    if (!playing) return;

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      // Cap delta so a background→foreground resume can't skip the whole clip
      // if visibility pause is late by one frame.
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setTime((current) => {
        const next = current + deltaSeconds;
        if (next >= 6.42) {
          setPlaying(false);
          return 6.42;
        }
        return next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [playing]);

  const timeline = buildTimeline(lessonSequence);
  const state = getBeatState(timeline, time);
  if (!state) {
    return null;
  }

  const curveHeight =
    state.beat.action === "shot"
      ? 0.05
      : state.beat.action === "carry"
        ? 0
        : 0.12;

  const curve = makePassCurve(state.beat.start, state.beat.end, curveHeight);
  const points = curve.getPoints(32);

  const t = state.easedProgress;
  const ballOnCurve = curve.getPoint(t);

  const drawnCount = Math.max(2, Math.floor(t * 32) + 1);
  const drawnPoints = points.slice(0, drawnCount);

  const pitchCenter = new THREE.Vector3(0, 0, 0);
  const followOffset = new THREE.Vector3(0, 60, 30);
  const tacticalOffset = new THREE.Vector3(50, 130, 0);

  const rigTarget =
    cameraMode === "tactical" ? pitchCenter : ballOnCurve;
  const rigOffset =
    cameraMode === "tactical" ? tacticalOffset : followOffset;
  const rigEnabled =
    cameraMode === "follow" || cameraMode === "tactical";

  const framePlayers = getFreezeFrame(lessonFreezeFrames, time);

  return (
    <div className={styles.stage}>
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{
            position: [0, 40, 30],
            fov: 50,
          }}
          style={{ width: "100%", height: "100%", background: "#dfe8e2" }}
          dpr={[1, 1.5]}
        >
          <CameraRig
            target={rigTarget}
            offset={rigOffset}
            enabled={rigEnabled}
          />
          <OrbitControls
            makeDefault
            enabled={cameraMode === "orbit"}
            target={ballOnCurve}
            enableDamping
          />

          <ambientLight intensity={1.15} />
          <pointLight position={[10, 20, 10]} intensity={1.2} />

          <Pitch />
          <BallTrail
            points={drawnPoints}
            ballPosition={ballOnCurve}
            endPosition={curve.getPoint(1)}
          />
          <PlayerMarkers players={framePlayers?.players ?? []} />
        </Canvas>
      </div>

      <Transport
        time={time}
        playing={playing}
        maxTime={6.42}
        cameraMode={cameraMode}
        onSeek={setTime}
        onCameraModeChange={setCameraMode}
        onTogglePlay={() => {
          if (!playing && time >= 6.42) {
            setTime(0);
          }
          setPlaying((current) => !current);
        }}
      />
    </div>
  );
}
