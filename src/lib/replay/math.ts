export function clamp(
    value: number,
    min = 0,
    max = 1
){
    if(value < min ){
        return min
    }
    if(value > max){
        return max
    }
    return value
}

export function lerp(
    start: number,
    end: number,
    t: number
){
    return(
    start + (end - start) * t
    )
}
    
export function smooth(
    t: number
){
    const clampedT = clamp(t)
    return(
        clampedT * clampedT * (3 - 2 * clampedT)
    )
}