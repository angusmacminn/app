import * as THREE from "three";
import { pitchToWorld } from "./coordinates";

/**
 * Build a quadratic Bézier for a pass/shot on the pitch.
 *
 * A quadratic Bézier needs 3 points:
 *   start   → where the ball begins
 *   control → a "pull" point that bends the path (the curve does not pass through it)
 *   end     → where the ball arrives
 */
export function makePassCurve(
  start: [number, number], // StatsBomb [x, y]
  end: [number, number],
  curveHeight: number, // 0 = straight-ish; higher = more bend
) {
  // Convert football pitch coords into Three.js world coords [x, height, z].
  // We use a small height (0.5) so the path sits slightly above the pitch plane.
  const startWorld = new THREE.Vector3(
    ...pitchToWorld(start[0], start[1], 0.5),
  );
  const endWorld = new THREE.Vector3(
    ...pitchToWorld(end[0], end[1], 0.5),
  );

  // 1. Chord = vector from start → end (direction + distance of the pass).
  // clone() first so we don't mutate endWorld when we .sub().
  const chord = endWorld.clone().sub(startWorld);
  const length = chord.length();

  // 2. Midpoint = halfway along that chord (lerp 0.5 = 50% between start and end).
  const midpoint = startWorld.clone().lerp(endWorld, 0.5);

  // 3. Perpendicular on the pitch plane (x–z).
  // Rotating (x, z) by 90° gives (-z, x). Y stays 0 so we bend sideways, not vertically.
  // normalize() → unit length 1, then scale by pass length * curveHeight.
  // Longer passes get a wider bend; curveHeight is your artistic knob.
  const perpendicular = new THREE.Vector3(-chord.z, 0, chord.x)
    .normalize()
    .multiplyScalar(length * curveHeight);

  // 4. Lift = push the control point up in world Y so the arc sits above the grass.
  const lift = new THREE.Vector3(0, 0.55, 0);

  // 5. Control = midpoint + sideways bend + upward lift.
  const control = midpoint.clone().add(perpendicular).add(lift);

  // Three.js curve object you can sample later with getPoint(t) where t is 0..1.
  return new THREE.QuadraticBezierCurve3(startWorld, control, endWorld);
}
