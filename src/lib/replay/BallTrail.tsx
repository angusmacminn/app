import { Line } from "@react-three/drei";

import type { Vector3 } from "three";
type BallTrailProps = {
  points: Vector3[];
  ballPosition: Vector3;
  endPosition: Vector3;
};

export default function BallTrail({
    points,
    ballPosition,
    endPosition,
  }: BallTrailProps){

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
        <Line 
                    points={points}
                    color="#f5d300"
                    lineWidth={2}
                    dashed
                    dashSize={1.5}
                    gapSize={1}
                />
        </>
    )
}