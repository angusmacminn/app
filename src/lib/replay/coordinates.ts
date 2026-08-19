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

/** Inverse of pitchToWorld (uses world X/Z; ignores height). */
export function worldToPitch(
  x: number,
  _y: number,
  z: number,
): [number, number] {
  return [x + 60, z + 40];
}
