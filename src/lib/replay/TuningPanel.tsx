"use client";

import styles from "./ReplayStage.module.css";

export type ReplayTuningSettings = {
  durationScale: number;
  carryCurve: number;
  passCurve: number;
  shotCurve: number;
  trailSegments: number;
  trailMinScale: number;
  trailMaxScale: number;
  trailLift: number;
  ballLift: number;
  fadeSeconds: number;
  cameraLag: number;
  followHeight: number;
  followDepth: number;
  tacticalHeight: number;
};

type Props = {
  settings: ReplayTuningSettings;
  onChange: (settings: ReplayTuningSettings) => void;
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, step, suffix = "", onChange }: SliderProps) {
  return (
    <label className={styles.tunerControl}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>
        {value.toFixed(step < 1 ? 2 : 0)}
        {suffix}
      </output>
    </label>
  );
}

export default function TuningPanel({ settings, onChange }: Props) {
  const update = <Key extends keyof ReplayTuningSettings>(
    key: Key,
    value: ReplayTuningSettings[Key],
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <details className={styles.tuner} open>
      <summary>Motion tuning</summary>

      <div className={styles.tunerGrid}>
        <section className={styles.tunerGroup}>
          <h3>Timing</h3>
          <Slider
            label="Duration scale"
            value={settings.durationScale}
            min={0.5}
            max={1.5}
            step={0.05}
            onChange={(value) => update("durationScale", value)}
          />
          <Slider
            label="Freeze fade"
            value={settings.fadeSeconds}
            min={0.1}
            max={1}
            step={0.05}
            suffix="s"
            onChange={(value) => update("fadeSeconds", value)}
          />
        </section>

        <section className={styles.tunerGroup}>
          <h3>Curve</h3>
          <Slider
            label="Carry"
            value={settings.carryCurve}
            min={0}
            max={0.5}
            step={0.01}
            onChange={(value) => update("carryCurve", value)}
          />
          <Slider
            label="Pass"
            value={settings.passCurve}
            min={0}
            max={0.35}
            step={0.01}
            onChange={(value) => update("passCurve", value)}
          />
          <Slider
            label="Shot"
            value={settings.shotCurve}
            min={0}
            max={0.2}
            step={0.01}
            onChange={(value) => update("shotCurve", value)}
          />
        </section>

        <section className={styles.tunerGroup}>
          <h3>Trail</h3>
          <Slider
            label="Particles"
            value={settings.trailSegments}
            min={8}
            max={64}
            step={1}
            onChange={(value) => update("trailSegments", value)}
          />
          <Slider
            label="Min size"
            value={settings.trailMinScale}
            min={0.1}
            max={0.8}
            step={0.05}
            onChange={(value) => update("trailMinScale", value)}
          />
          <Slider
            label="Max size"
            value={settings.trailMaxScale}
            min={0.4}
            max={2}
            step={0.05}
            onChange={(value) => update("trailMaxScale", value)}
          />
          <Slider
            label="Trail lift"
            value={settings.trailLift}
            min={0}
            max={1.5}
            step={0.05}
            onChange={(value) => update("trailLift", value)}
          />
          <Slider
            label="Ball lift"
            value={settings.ballLift}
            min={0}
            max={3}
            step={0.1}
            onChange={(value) => update("ballLift", value)}
          />
        </section>

        <section className={styles.tunerGroup}>
          <h3>Camera</h3>
          <Slider
            label="Lag"
            value={settings.cameraLag}
            min={0.5}
            max={5}
            step={0.1}
            onChange={(value) => update("cameraLag", value)}
          />
          <Slider
            label="Follow height"
            value={settings.followHeight}
            min={20}
            max={120}
            step={1}
            onChange={(value) => update("followHeight", value)}
          />
          <Slider
            label="Follow depth"
            value={settings.followDepth}
            min={0}
            max={90}
            step={1}
            onChange={(value) => update("followDepth", value)}
          />
          <Slider
            label="Tactical height"
            value={settings.tacticalHeight}
            min={60}
            max={160}
            step={1}
            onChange={(value) => update("tacticalHeight", value)}
          />
        </section>
      </div>
    </details>
  );
}
