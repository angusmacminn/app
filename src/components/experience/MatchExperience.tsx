"use client"

import { useState } from 'react'
import { moments } from '@/data/moments'
import ReplayView from './ReplayView'
import MatchSelector from './MatchSelector'

export default function MatchExperience(){

    const [selectedId, setSelectedId] = useState<string | null>(null)
    
    const selectedMoment = moments.find(
        (moment) => moment.id === selectedId
    )

    if (selectedMoment?.status === "ready") {
        return <ReplayView moment={selectedMoment} />;
      }


    return(
    <>
        <MatchSelector
        moments={moments}
        onSelect={setSelectedId}
        />   
    </>
    )
}