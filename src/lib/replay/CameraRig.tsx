"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type CameraRigProps = {
  target: THREE.Vector3;
  offset: THREE.Vector3;
  lag?: number;
  enabled: boolean;
  /** Straight-overhead lookAt needs a locked up vector or yaw drifts */
  topDown?: boolean;
};

export default function CameraRig({
  target,
  lag = 5,
  enabled,
  offset,
  topDown = false,
}: CameraRigProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!enabled) return;

    if (topDown) {
      // Looking straight down: world +Y is parallel to view, so lock up to pitch -Z
      camera.up.set(0, 0, -1);
    } else {
      camera.up.set(0, 1, 0);
    }

    const desired = target.clone().add(offset);
    const alpha = 1 - Math.exp(-lag * delta);
    camera.position.lerp(desired, alpha);
    camera.lookAt(target);
  });

  return null;
}
