import lessonSequence, {
    lessonFreezeFrames,
    type LessonBeat,
  } from "./lesson-sequence";
import type { FreezeFrame } from "@/lib/replay/freezeframe";

  type MomentMetadata = {
    id: string;
    fixture: string;
    competition: string;
    venue?: string;
    date?: string;
    description: string;
  }

  export type ReadyMoment = MomentMetadata & {
    status: "ready";
    replay: {
      beats: LessonBeat[];
      freezeFrames: FreezeFrame[];
    }
  }

  export type ComingSoonMoment = MomentMetadata & {
    status: "coming-soon"
    replay?: never;
  }

  export type ReplayMoment = ReadyMoment | ComingSoonMoment;


  export const moments = [
    {
      id: "spain-germany-olmo-51",
      fixture: "Spain vs Germany",
      competition: "Euro 2024",
      description: "Goal — Dani Olmo, 51′",
      status: "ready",
      replay: {
        beats: lessonSequence,
        freezeFrames: lessonFreezeFrames,
      },
    },
    {
      id: "barcelona-real-madrid",
      fixture: "Barcelona vs Real Madrid",
      competition: "La Liga",
      description: "Replay unavailable",
      status: "coming-soon",
    },
    {
      id: "bayern-psg",
      fixture: "Bayern Munich vs PSG",
      competition: "UCL",
      description: "Replay unavailable",
      status: "coming-soon",
    },
  ] satisfies ReplayMoment[];


