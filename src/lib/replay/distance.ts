type ActionCoordinates = {
    start: number[];
    end: number[];
};

export function getActionDistance(action: ActionCoordinates){
    const dx = action.end[0] - action.start[0];
    const dy = action.end[1] - action.start[1];
    
    return (
        Math.hypot(dx, dy)
    )
}