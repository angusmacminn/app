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

type FreezePlayer = {
  id: string;
  name?: string;
  team: "home" | "away";
  /** Pitch coords, same space as beat start/end */
  position: Point;
};

type FreezeFrame = {
  /** Seconds on the shared replay clock */
  time: number;
  players: FreezePlayer[];
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

// Real StatsBomb 360 freeze_frames for the three event UUIDs above.
// times align with beat starts on the shared clock (carry → pass → shot).
// home = Spain (attacking), away = Germany. Only the on-ball actor is named.
const lessonFreezeFrames: FreezeFrame[] = [
  {
    time: 0,
    players: [
      { id: "home-0", team: "home", position: [75.0, 26.9] },
      { id: "away-1", team: "away", position: [76.8, 68.1] },
      { id: "home-2", team: "home", position: [78.3, 58.3] },
      { id: "away-3", team: "away", position: [80.8, 21.2] },
      { id: "away-4", team: "away", position: [81.1, 36.6] },
      { id: "home-5", team: "home", position: [85.9, 10.5] },
      { id: "away-6", team: "away", position: [87.5, 54.6] },
      { id: "home-7", team: "home", position: [88.7, 34.9] },
      { id: "away-8", team: "away", position: [90.7, 43.0] },
      {
        id: "yamal",
        name: "Lamine Yamal",
        team: "home",
        position: [90.8, 70.0],
      },
      { id: "away-10", team: "away", position: [91.4, 60.9] },
      { id: "away-11", team: "away", position: [92.2, 32.1] },
      { id: "away-gk", team: "away", position: [115.9, 42.9] },
    ],
  },
  {
    time: 3.904,
    players: [
      { id: "home-0", team: "home", position: [93.4, 48.2] },
      { id: "home-1", team: "home", position: [97.5, 33.2] },
      { id: "away-2", team: "away", position: [97.9, 58.2] },
      { id: "away-3", team: "away", position: [98.8, 43.4] },
      { id: "home-4", team: "home", position: [102.2, 27.1] },
      { id: "home-5", team: "home", position: [102.4, 34.2] },
      { id: "away-6", team: "away", position: [103.5, 28.9] },
      {
        id: "yamal",
        name: "Lamine Yamal",
        team: "home",
        position: [103.9, 57.7],
      },
      { id: "away-8", team: "away", position: [104.2, 55.4] },
      { id: "away-9", team: "away", position: [105.1, 36.4] },
      { id: "away-10", team: "away", position: [107.2, 34.1] },
      { id: "away-11", team: "away", position: [107.3, 49.7] },
      { id: "away-gk", team: "away", position: [117.2, 41.3] },
    ],
  },
  {
    time: 4.863,
    players: [
      { id: "home-0", team: "home", position: [83.4, 68.3] },
      { id: "home-1", team: "home", position: [95.6, 50.2] },
      { id: "away-2", team: "away", position: [101.2, 60.1] },
      { id: "away-3", team: "away", position: [101.2, 48.1] },
      {
        id: "olmo",
        name: "Dani Olmo",
        team: "home",
        position: [103.6, 42.7],
      },
      { id: "home-5", team: "home", position: [104.5, 58.1] },
      { id: "home-6", team: "home", position: [104.5, 35.1] },
      { id: "home-7", team: "home", position: [105.2, 36.7] },
      { id: "away-8", team: "away", position: [106.5, 40.9] },
      { id: "away-9", team: "away", position: [106.5, 56.3] },
      { id: "away-10", team: "away", position: [107.6, 34.8] },
      { id: "away-11", team: "away", position: [109.1, 50.5] },
      { id: "away-12", team: "away", position: [109.5, 37.9] },
      { id: "away-gk", team: "away", position: [118.1, 44.0] },
    ],
  },
];

export { lessonFreezeFrames };
export default lessonSequence;
