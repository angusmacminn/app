import styles from "./ReplayStage.module.css";

type CameraMode = "follow" | "tactical" | "orbit";

type TransportProps = {
  time: number;
  playing: boolean;
  maxTime: number;
  cameraMode: CameraMode;
  onSeek: (next: number) => void;
  onTogglePlay: () => void;
  onCameraModeChange: (mode: CameraMode) => void;
};

const CAMERA_MODES: { id: CameraMode; label: string }[] = [
  { id: "follow", label: "Follow" },
  { id: "tactical", label: "Tactical" },
  { id: "orbit", label: "Orbit" },
];

export default function Transport({
  time,
  playing,
  maxTime,
  cameraMode,
  onSeek,
  onTogglePlay,
  onCameraModeChange,
}: TransportProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onTogglePlay}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <div className={styles.scrubber}>
          <input
            className={styles.range}
            type="range"
            min={0}
            max={maxTime}
            step={0.01}
            value={time}
            onChange={(event) => onSeek(Number(event.target.value))}
            aria-label="Replay time"
          />
          <span className={styles.time}>{time.toFixed(2)}s</span>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Camera</span>
        <div className={styles.modeGroup}>
          {CAMERA_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`${styles.button} ${
                cameraMode === mode.id ? styles.buttonActive : ""
              }`}
              onClick={() => onCameraModeChange(mode.id)}
              aria-pressed={cameraMode === mode.id}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span>
          <i className={`${styles.swatch} ${styles.swatchHome}`} />
          Spain
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.swatchAway}`} />
          Germany
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.swatchBall}`} />
          Ball
        </span>
      </div>
    </div>
  );
}
