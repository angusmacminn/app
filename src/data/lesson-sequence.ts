import type { Point } from "@/lib/replay/timeline";

type LessonBeat = {
  id: string;
  player: string;
  action: "carry" | "pass" | "shot";
  recipient?: string;
  start: Point;
  end: Point;
  duration: number;
};

// StatsBomb Open Data: Spain vs Germany, match 3942226.
// These are the final three actions in Spain's 51' Dani Olmo goal sequence.
const lessonSequence: LessonBeat[] = [
  {
    id: "8404d957-5d26-4b67-8760-95ef4f47fd8a",
    player: "Lamine Yamal",
    action: "carry",
    start: [90.8, 70],
    end: [103.9, 57.7],
    duration: 3.904,
  },
  {
    id: "2b839e6a-5c58-4a2d-a123-d1b0fb73b341",
    player: "Lamine Yamal",
    action: "pass",
    recipient: "Dani Olmo",
    start: [103.9, 57.7],
    end: [103.6, 42.7],
    duration: 0.959,
  },
  {
    id: "cc32f902-7e4b-4df8-981b-0c7fbe4b7681",
    player: "Dani Olmo",
    action: "shot",
    start: [103.6, 42.7],
    end: [120, 37.2],
    duration: 0.796,
  },
];

export default lessonSequence;