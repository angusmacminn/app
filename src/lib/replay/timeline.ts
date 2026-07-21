import { clamp, smooth } from "./math"

type ActionInput = {
    duration: number;
}

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


type TimelineAction = {
    duration: number,
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
    const settling = time > beat.endTime && 
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

    return {
        index: safeIndex,
        beat,
        settling,
        elapsedTime,
        progress,
        easedProgress,
    }
}