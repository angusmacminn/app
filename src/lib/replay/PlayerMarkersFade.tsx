"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { FreezePlayer } from "./freezeframe";
import PlayerMarkers from "./PlayerMarkers";

const FADE_SECONDS = 0.4;

type Props = {
  players: FreezePlayer[];
  /** FreezeFrame.time — changes when the active freeze switches */
  frameTime: number;
};

/**
 * Crossfades player markers when the active freeze frame changes.
 * No identity matching — old set fades out, new set fades in.
 */
export default function PlayerMarkersFade({ players, frameTime }: Props) {
  const [displayPlayers, setDisplayPlayers] = useState(players);
  const [outgoingPlayers, setOutgoingPlayers] = useState<FreezePlayer[]>([]);
  const [fade, setFade] = useState(1);

  const displayTimeRef = useRef(frameTime);
  const displayPlayersRef = useRef(players);
  const isFirstRef = useRef(true);
  const fadingRef = useRef(false);

  useEffect(() => {
    // First mount: snap to the current freeze (no fade from empty)
    if (isFirstRef.current) {
      isFirstRef.current = false;
      displayTimeRef.current = frameTime;
      displayPlayersRef.current = players;
      setDisplayPlayers(players);
      setOutgoingPlayers([]);
      setFade(1);
      fadingRef.current = false;
      return;
    }

    // Same freeze time — nothing to crossfade
    if (frameTime === displayTimeRef.current) {
      return;
    }

    // Freeze changed: keep old players as outgoing, show new as incoming
    setOutgoingPlayers(displayPlayersRef.current);
    setDisplayPlayers(players);
    displayPlayersRef.current = players;
    displayTimeRef.current = frameTime;
    setFade(0);
    fadingRef.current = true;
  }, [frameTime, players]);

  useFrame((_, delta) => {
    if (!fadingRef.current) return;

    setFade((current) => {
      const next = Math.min(1, current + delta / FADE_SECONDS);
      if (next >= 1) {
        fadingRef.current = false;
        setOutgoingPlayers([]);
      }
      return next;
    });
  });

  const isFading = outgoingPlayers.length > 0;

  return (
    <>
      {isFading && (
        <PlayerMarkers players={outgoingPlayers} opacity={1 - fade} />
      )}
      <PlayerMarkers
        players={displayPlayers}
        opacity={isFading ? fade : 1}
      />
    </>
  );
}
