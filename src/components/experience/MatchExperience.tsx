"use client"

import { useState } from 'react'
import { moments } from '@/data/moments'
import ReplayView from './ReplayView'

export default function MatchExperience(){

    const [selectedId, setSelectedId] = useState<string | null>(null)
    
    const selectedMoment = moments.find(
        (moment) => moment.id === selectedId
    )


    return(
        <>
        <div>
            {moments.map((moment) => (
                <button
                    key={moment.id}
                    disabled={moment.status === "coming-soon"}
                    onClick={()=> setSelectedId(moment.id)}
                >
                    {moment.fixture}
                </button>
            ))}
        </div>
        {selectedMoment?.status === "ready" && (
            <ReplayView moment={selectedMoment} />
        )}    
        </>
    )
}