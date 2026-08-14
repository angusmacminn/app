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
            dummy.position.copy(points[i])
            dummy.scale.setScalar(1)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
        }

        mesh.count = points.length // only draw this many instances
        mesh.instanceMatrix.needsUpdate = true
    }, [points]) // re run whenever the trail points change

    return(
        <>
        {/* shot START marker mesh */}
        <mesh position={ballPosition}>
                <boxGeometry 
                    args={[2, 2, 2]}
                />
                <meshStandardMaterial color="#f5d300"/>
        </mesh>
                
        {/* current beat end (on the same curve) */}
        <mesh position={endPosition}>
            <boxGeometry 
                args={[2, 2, 2]}
            />
            <meshStandardMaterial color="#ffffff"/>
        </mesh>
        {/* pass curve */}
        <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_COUNT]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color={"#f5d300"}/>
        </instancedMesh>
        
        </>
    )
}