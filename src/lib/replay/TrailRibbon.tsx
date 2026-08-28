"use client";
import { useMemo } from "react";
import * as THREE from "three";
import type { Vector3 } from "three";


type RibbonProps = {
    points: Vector3[]
    width?: number
    opacity?: number
}

function buildRibbonGeometry(points: Vector3[], width: number){
    const geometry = new THREE.BufferGeometry()

    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    for (let i = 0; i< points.length; i++){
        const point = points[i]

        const prev = points[Math.max(i - 1, 0)]
        const next = points[Math.min(i + 1, points.length - 1)]

        // direction of the trail at this point
        const direction = next.clone().sub(prev)

        if (direction.lengthSq() === 0) {
            direction.set(1, 0, 0);
          }
          direction.normalize();
          // Perpendicular direction on the pitch plane.
          // X/Z are the ground axes in your world.
          const side = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
          const u = points.length === 1 ? 0 : i / (points.length - 1);
          // Optional: wider in the middle, thinner at ends
          const envelope = Math.sin(u * Math.PI);
          const localWidth = width * (0.25 + 0.75 * envelope);
          const left = point.clone().addScaledVector(side, localWidth / 2);
          const right = point.clone().addScaledVector(side, -localWidth / 2);
          positions.push(left.x, left.y + 0.08, left.z);
          positions.push(right.x, right.y + 0.08, right.z);
          uvs.push(u, 0);
          uvs.push(u, 1);
          if (i < points.length - 1) {
            const a = i * 2;
            const b = a + 1;
            const c = a + 2;
            const d = a + 3;
            indices.push(a, b, c);
            indices.push(b, d, c);
          }
        }
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute(
          "uv",
          new THREE.Float32BufferAttribute(uvs, 2),
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
    }

    export default function TrailRibbon({ points, width = 2, opacity = 1 }: RibbonProps) {
        const geometry = useMemo(() => {
          return buildRibbonGeometry(points, width);
        }, [points, width]);
      
        if (points.length < 2) {
          return null;
        }
      
        return (
          <mesh geometry={geometry} frustumCulled={false}>
            <meshBasicMaterial
              color="#ffe943"
              opacity={opacity}
              transparent={opacity < 1}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        );
      }