import { Line } from "@react-three/drei";
import { useRef, useLayoutEffect } from "react";
import * as THREE from "three"

import type { Vector3 } from "three";
type BallTrailProps = {
  points: Vector3[];
  ballPosition: Vector3;
  endPosition: Vector3;
};

const MAX_COUNT = 64 // longest points array

// one reuseable temp object - create once outside the component
const dummy = new THREE.Object3D()

export default function BallTrail({
    points,
    ballPosition,
    endPosition,
  }: BallTrailProps){

    // mesh ref
    const meshRef = useRef<THREE.InstancedMesh>(null)

    useLayoutEffect(() => {
        const mesh = meshRef.current
        if(!mesh) return

        for(let i = 0; i < points.length; i++){
            // have particles grow large in the middle of the trail
            const u = points.length === 1 ? 0.5 : i / (points.length -1)
            const envelope = Math.sin(u * Math.PI)
            const scale = 0.25 + 0.9 * envelope // min - max

            dummy.position.copy(points[i])
            dummy.position.y += 0.3
            dummy.scale.setScalar(scale)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
        }

        mesh.count = points.length // only draw this many instances
        mesh.instanceMatrix.needsUpdate = true
    }, [points]) // re run whenever the trail points change

    return(
        <>
        {/* Ball sits above player markers so carries don't z-fight */}
        <mesh position={[ballPosition.x, ballPosition.y + 1.5, ballPosition.z]}>
                <boxGeometry 
                    args={[1, 1, 1]}
                />
                <meshStandardMaterial color="#ffe943"/>
        </mesh>
                
        {/* current beat end (on the same curve) */}
        {/* <mesh position={endPosition}>
            <boxGeometry 
                args={[2, 2, 2]}
            />
            <meshStandardMaterial color="#ffffff"/>
        </mesh> */}
        {/* pass curve */}
        <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_COUNT]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color={"#ffe943"}/>
        </instancedMesh>
        
        </>
    )
}