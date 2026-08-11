"use client"

import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three";

type CameraRigProps = {
    target: THREE.Vector3
    offset: THREE.Vector3
    lag?: number
    enabled: boolean 
}


export default function CameraRig({ target, lag = 2, enabled, offset }: CameraRigProps) {
  const { camera } = useThree();
  

  useFrame((_, delta) => {

    if(!enabled) return

    const desired = target.clone().add(offset)
    const alpha = 1 - Math.exp(-lag * delta)
    camera.position.lerp(desired, alpha)
    camera.lookAt(target)

  });
  return null; // no mesh — only moves the camera
}