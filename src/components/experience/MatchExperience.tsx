"use client"

import { useState } from 'react'
import { moments } from '@/data/moments'
import ReplayView from './ReplayView'
import MatchSelector from './MatchSelector'

import {
    AnimatePresence,
    LayoutGroup,
    motion,
  } from "motion/react";

export default function MatchExperience(){

    const [selectedId, setSelectedId] = useState<string | null>(null)
    
    const selectedMoment = moments.find(
        (moment) => moment.id === selectedId
    )


    return(
    <>
    <LayoutGroup>
        <AnimatePresence mode='sync' initial={false}>
            {selectedMoment?.status === 'ready' ? (
                <motion.div
                    key="replay"
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity:0}}
                >
                    <ReplayView moment={selectedMoment}/>
                </motion.div>
            ) : (
                <motion.div
                    key="selector"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <MatchSelector
                        moments={moments}
                        onSelect={setSelectedId}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </LayoutGroup>
           
    </>
    )
}