import { pitchToWorld } from "./coordinates"
import { FreezePlayer } from "./freezeframe"

type Props = {
    players: FreezePlayer[]
}

export default function PlayerMarkers({ players}: Props){

    return (
        <>
        {players.map((player) => {
            const position = pitchToWorld(player.position[0], player.position[1], 0.5)

            return(
                <mesh key={player.id} position={position}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial 
                        color={player.team === "home" ? "#e10600" : "#1d4ed8"}
                    />
                </mesh>
            )
        })}

        
        </>
    )
}