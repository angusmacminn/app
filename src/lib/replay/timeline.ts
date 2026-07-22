import { clamp, smooth, lerp } from "./math"

type ActionInput = {
    duration: number;
    start: number[];
    end: number[];
}
// converts action durations into absolute replay times
export function buildTimeline(
    actions: ActionInput[],
    settle = 0.4,
) { 
    let cursor = 0

    return actions.map((action) => {
        const startTime = cursor
        const endTime = startTime + action.duration

        cursor = endTime + settle

        return {
            ...action,
            startTime,
            endTime
        }
    })
}

// & means TimelineAction contains everything from ActionInput and the timing properties.
type TimelineAction = ActionInput & {
    startTime: number,
    endTime: number,
}

export function getBeatState(
    timeline: TimelineAction[],
    time: number,
    settle = 0.4,
){
    // edge-case gaurd
    if(timeline.length === 0){
        return null
    }
    // findIndex goes through each beat and returns first true callback result
    const index = timeline.findIndex((beat) => {
        // Is the replay clock still at or before this beat’s deadline?
        return time < beat.endTime + settle;
    })

    const safeIndex = 
        index === -1 ? timeline.length - 1 : index;

    const beat = timeline[safeIndex];

    // calculate the end of the settle state
    const settleEnd = beat.endTime + settle;

    // Settling begins when the replay clock has passed the action’s endTime
    const settling = time >= beat.endTime && 
                     time < settleEnd

    // local action progress
    const elapsedTime = clamp(
        time - beat.startTime,
        0,
        beat.duration,
    )
    const progress = elapsedTime / beat.duration;

    // add smoothstep
    const easedProgress = smooth(progress)

    // calculate ball start + end position with lerp
    const position = [
        lerp(beat.start[0], beat.end[0], easedProgress),
        lerp(beat.start[1], beat.end[1], easedProgress),
    ]

    return {
        index: safeIndex,
        beat,
        settling,
        elapsedTime,
        progress,
        easedProgress,
        position,
    }
}