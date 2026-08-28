"use client";
import { useState, useEffect, useMemo } from "react";
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
import { worldToPitch } from "./coordinates";
import PlayerMarkersFade from "./PlayerMarkersFade";
import styles from "./ReplayStage.module.css";
import TuningPanel, { type ReplayTuningSettings } from "./TuningPanel";

type CameraMode = "follow" | "tactical" | "orbit";

const DEFAULT_TUNING: ReplayTuningSettings = {
  durationScale: 1,
  carryCurve: 0.2,
  passCurve: 0.12,
  shotCurve: 0.05,
  trailSegments: 32,
  trailMinScale: 0.25,
  trailMaxScale: 1.15,
  trailLift: 0.3,
  ballLift: 1.5,
  fadeSeconds: 0.4,
  cameraLag: 1,
  followHeight: 60,
  followDepth: 30,
  tacticalHeight: 90,
};

export default function ReplayStage() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("follow");
  const [tuning, setTuning] = useState(DEFAULT_TUNING);

  const tunedSequence = useMemo(() => {
    return lessonSequence.map((beat) => ({
      ...beat,
      duration: beat.duration * tuning.durationScale,
    }));
  }, [tuning.durationScale]);

  const tunedFreezeFrames = useMemo(() => {
    return lessonFreezeFrames.map((frame) => ({
      ...frame,
      time: frame.time * tuning.durationScale,
    }));
  }, [tuning.durationScale]);

  const timeline = useMemo(() => buildTimeline(tunedSequence), [tunedSequence]);
  const maxTime = timeline.at(-1)?.endTime ?? 0;

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
    if (!playing || maxTime === 0) return;

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      // Cap delta so a background→foreground resume can't skip the whole clip
      // if visibility pause is late by one frame.
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setTime((current) => {
        const next = current + deltaSeconds;
        if (next >= maxTime) {
          setPlaying(false);
          return maxTime;
        }
        return next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [playing, maxTime]);

  const replayTime = Math.min(time, maxTime);
  const state = getBeatState(timeline, replayTime);
  if (!state) {
    return null;
  }

  const curveHeight =
    state.beat.action === "shot"
      ? tuning.shotCurve
      : state.beat.action === "carry"
        ? tuning.carryCurve
        : tuning.passCurve;

  const curve = makePassCurve(state.beat.start, state.beat.end, curveHeight);
  const points = curve.getPoints(tuning.trailSegments);

  const t = state.easedProgress;
  const ballOnCurve = curve.getPoint(t);

  const drawnCount = Math.max(2, Math.floor(t * tuning.trailSegments) + 1);
  const drawnPoints = points.slice(0, drawnCount);

  // if carry, have player move with the ball (same curve as ballOnCurve)
  const carrierId = state.beat.action === "carry" ? "yamal" : null;
  const carrierPitchPos =
    state.beat.action === "carry"
      ? worldToPitch(ballOnCurve.x, ballOnCurve.y, ballOnCurve.z)
      : null;

  // { CAMERA SETTINGS }
  const pitchCenter = new THREE.Vector3(0, 0, 0);
  const followOffset = new THREE.Vector3(0, tuning.followHeight, tuning.followDepth);
  const tacticalOffset = new THREE.Vector3(0, tuning.tacticalHeight, 0);

  const rigTarget =
    cameraMode === "tactical" ? pitchCenter : ballOnCurve;
  const rigOffset =
    cameraMode === "tactical" ? tacticalOffset : followOffset;
  const rigEnabled =
    cameraMode === "follow" || cameraMode === "tactical";

  const framePlayers = getFreezeFrame(tunedFreezeFrames, replayTime);

  return (
    <div className={styles.stage}>
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{
            position: [0, 40, 30],
            fov: 50,
          }}
          style={{ width: "100%", height: "100%", background: "#d8ffbf" }}
          dpr={[1, 1.5]}
        >
          <CameraRig
            target={rigTarget}
            offset={rigOffset}
            enabled={rigEnabled}
            topDown={cameraMode === "tactical"}
            lag={tuning.cameraLag}
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
            trailMinScale={tuning.trailMinScale}
            trailMaxScale={tuning.trailMaxScale}
            trailLift={tuning.trailLift}
            ballLift={tuning.ballLift}
          />
          <PlayerMarkersFade
            players={framePlayers?.players ?? []}
            frameTime={framePlayers?.time ?? -1}
            carrierId={carrierId}
            carrierPitchPos={carrierPitchPos}
            fadeSeconds={tuning.fadeSeconds}
          />
        </Canvas>
      </div>

      <Transport
        time={replayTime}
        playing={playing}
        maxTime={maxTime}
        cameraMode={cameraMode}
        onSeek={setTime}
        onCameraModeChange={setCameraMode}
        onTogglePlay={() => {
          if (!playing && replayTime >= maxTime) {
            setTime(0);
          }
          setPlaying((current) => !current);
        }}
      />
      <TuningPanel settings={tuning} onChange={setTuning} />
    </div>
  );
}
