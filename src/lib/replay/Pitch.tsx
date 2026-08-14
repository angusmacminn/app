import { pitchToWorld } from "./coordinates"
import { Line } from "@react-three/drei";

const boundary = [
    pitchToWorld(0, 0, 0.02),
    pitchToWorld(120, 0, 0.02),
    pitchToWorld(120, 80, 0.02),
    pitchToWorld(0, 80, 0.02),
    pitchToWorld(0, 0, 0.02), // close the loop
  ]

const halfwayLine = [
    pitchToWorld(60, 0, 0.02),
    pitchToWorld(60,80, 0.02)
]

const leftPenaltyBox = [
    pitchToWorld(0, 18, 0.02),
    pitchToWorld(18, 18, 0.02),
    pitchToWorld(18, 62, 0.02),
    pitchToWorld(0, 62, 0.02),
    pitchToWorld(0, 18, 0.02),
  ]
  
  const rightPenaltyBox = [
    pitchToWorld(120, 18, 0.02),
    pitchToWorld(102, 18, 0.02),
    pitchToWorld(102, 62, 0.02),
    pitchToWorld(120, 62, 0.02),
    pitchToWorld(120, 18, 0.02),
  ]
  
  const leftSixYardBox = [
    pitchToWorld(0, 30, 0.02),
    pitchToWorld(6, 30, 0.02),
    pitchToWorld(6, 50, 0.02),
    pitchToWorld(0, 50, 0.02),
    pitchToWorld(0, 30, 0.02),
  ]
  
  const rightSixYardBox = [
    pitchToWorld(120, 30, 0.02),
    pitchToWorld(114, 30, 0.02),
    pitchToWorld(114, 50, 0.02),
    pitchToWorld(120, 50, 0.02),
    pitchToWorld(120, 30, 0.02),
  ]

const CENTER_X = 60
const CENTER_Y = 40
const CENTER_RADIUS = 9.15
const CIRCLE_SEGMENTS = 64

const centerCircle = Array.from({ length: CIRCLE_SEGMENTS + 1 }, (_, i) => {
  const angle = (i / CIRCLE_SEGMENTS) * Math.PI * 2
  const x = CENTER_X + Math.cos(angle) * CENTER_RADIUS
  const y = CENTER_Y + Math.sin(angle) * CENTER_RADIUS
  return pitchToWorld(x, y, 0.02)
})

const centerSpot = Array.from({ length: 17 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2
    return pitchToWorld(
      CENTER_X + Math.cos(angle) * 0.3,
      CENTER_Y + Math.sin(angle) * 0.3,
      0.02,
    )
  })

export default function Pitch(){

    return(
        <>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 80]} />
            <meshStandardMaterial color="#3f8f5a" />
        </mesh>
        {/* pitch bounds */}
         <Line 
         points={boundary}
         color="#fff"
         lineWidth={2}
        />
        {/* halfwayline */}
        <Line 
            points={halfwayLine}
            color="#fff"
            lineWidth={2}
        />
        {/* left penalty box */}
        <Line 
            points={leftPenaltyBox}
            color="#fff"
            lineWidth={2}
        />
        {/* left 6 yd box */}
        <Line 
            points={leftSixYardBox}
            color="#fff"
            lineWidth={2}
        />
        {/* right penalty box  */}
        <Line 
            points={rightPenaltyBox}
            color="#fff"
            lineWidth={2}
        />
        {/* right 6 yd box */}
        <Line 
            points={rightSixYardBox}
            color="#fff"
            lineWidth={2}
        />
        <Line points={centerCircle} color="#fff" lineWidth={2} />
        <Line points={centerSpot} color="#fff" lineWidth={2} />
    
     </>
    )
}