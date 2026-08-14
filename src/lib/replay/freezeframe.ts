export type FreezePlayer = {
    id: string
    name?: string
    team: "home" | "away"
    position: [number, number]
}

export type FreezeFrame = {
    time: number
    players: FreezePlayer[]
}


export function getFreezeFrame(
    frames: FreezeFrame[], 
    time: number
    ): FreezeFrame | null {
    if(frames.length === 0){
        return null
    }

    let active: FreezeFrame | null = null;
    
    for (const frame of frames) {
      if (frame.time <= time) {
        active = frame;
      } else {
        // frames are in time order — nothing later can be active yet
        break;
      }
    }
    return active;
}