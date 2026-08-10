

export default function Pitch(){

    return(
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 80]} />
            <meshStandardMaterial color="green" />
        </mesh>
    )
}