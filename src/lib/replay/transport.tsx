type TransportProps = {
  time: number,
  playing: boolean,
  maxTime: number,
  onSeek: (next: number) => void;
  onTogglePlay: () => void;
}


export default function Transport({
  time,
  playing,
  maxTime,
  onSeek,
  onTogglePlay
}: TransportProps) {
    return(
        <div>
            <button type="button" onClick={onTogglePlay}>
              {playing ? "pause" : "play"}
            </button>
            <input
              type="range"
              min={0}
              max={maxTime}
              step={0.01}
              value={time}
              onChange={(event) => onSeek(Number(event.target.value))}
            />
            <span>{time.toFixed(2)}s</span>
        </div>
        
    )
}