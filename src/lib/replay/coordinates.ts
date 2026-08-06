export function pitchToWorld (
    x: number,
    y: number,
    height: number = 0,
) : [number, number, number] {
    return [
        x - 60,
        height,
        y - 40,
    ]
}