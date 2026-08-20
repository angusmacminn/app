import { Html } from "@react-three/drei";
import { pitchToWorld } from "./coordinates"
import { FreezePlayer } from "./freezeframe"

type Props = {
    players: FreezePlayer[]
    opacity?: number
}

function getLastName(name: string) {
    const parts = name.trim().split(/\s+/)
    return parts[parts.length - 1]
}

export default function PlayerMarkers({ players, opacity = 1 }: Props){

    return (
        <>
        {players.map((player) => {
            const position = pitchToWorld(player.position[0], player.position[1], 0.5)
            const label = player.name ? getLastName(player.name) : null

            return(
                <group key={player.id} position={position}>
                    <mesh>
                        <boxGeometry args={[2, 2, 2]} />
                        <meshStandardMaterial 
                            color={player.team === "home" ? "#ff4343" : "#4366ff"}
                            transparent={true}
                            opacity={opacity}
                        />
                    </mesh>
                    {label && (
                        <Html
                            center
                            position={[0, -4, 0]}
                            style={{
                                color: "#14201a",
                                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                fontSize: "12px",
                                fontWeight: 500,
                                opacity,
                                pointerEvents: "none",
                                textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {label}
                        </Html>
                    )}
                </group>
            )
        })}

        
        </>
    )
}