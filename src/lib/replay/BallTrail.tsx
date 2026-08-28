import { useRef, useLayoutEffect } from "react";
import * as THREE from "three"

import type { Vector3 } from "three";
type BallTrailProps = {
  points: Vector3[];
  ballPosition: Vector3;
  endPosition: Vector3;
  trailMinScale?: number;
  trailMaxScale?: number;
  trailLift?: number;
  ballLift?: number;
};

const MAX_COUNT = 65 // getPoints(64) returns 65 points

// one reuseable temp object - create once outside the component
const dummy = new THREE.Object3D()

export default function BallTrail({
    points,
    ballPosition,
    trailMinScale = 0.25,
    trailMaxScale = 1.15,
    trailLift = 0.3,
    ballLift = 1.5,
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
            const scale = trailMinScale + (trailMaxScale - trailMinScale) * envelope

            dummy.position.copy(points[i])
            dummy.position.y += trailLift
            dummy.scale.setScalar(scale)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
        }

        mesh.count = points.length // only draw this many instances
        mesh.instanceMatrix.needsUpdate = true
    }, [points, trailMinScale, trailMaxScale, trailLift]) // re run whenever trail shape changes

    return(
        <>
        {/* Ball sits above player markers so carries don't z-fight */}
        <mesh position={[ballPosition.x, ballPosition.y + ballLift, ballPosition.z]}>
                <boxGeometry 
                    args={[1, 1, 1]}
                />
                <meshBasicMaterial color="#69FF43" toneMapped={false}/>
        </mesh>
                
        {/* current beat end (on the same curve) */}
        {/* <mesh position={endPosition}>
            <boxGeometry 
                args={[2, 2, 2]}
            />
            <meshStandardMaterial color="#ffffff"/>
        </mesh> */}
        {/* pass / shot trail */}
        <instancedMesh frustumCulled={false} ref={meshRef} args={[undefined, undefined, MAX_COUNT]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial
  color="#ffe943"
  emissive="#ffe943"
  emissiveIntensity={0.8}
  toneMapped={false}
/>       
        </instancedMesh>
        
        </>
    )
}