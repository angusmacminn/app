"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { withCarrierOnBall, type FreezePlayer } from "./freezeframe";
import PlayerMarkers from "./PlayerMarkers";

type Props = {
  players: FreezePlayer[];
  /** FreezeFrame.time — changes when the active freeze switches */
  frameTime: number;
  carrierId: string | null;
  carrierPitchPos: [number, number] | null
  fadeSeconds?: number;
};

/**
 * Crossfades player markers when the active freeze frame changes.
 * No identity matching — old set fades out, new set fades in.
 */
export default function PlayerMarkersFade({
  players,
  frameTime,
  carrierId,
  carrierPitchPos,
  fadeSeconds = 0.4,
}: Props) {
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
      const next = Math.min(1, current + delta / fadeSeconds);
      if (next >= 1) {
        fadingRef.current = false;
        setOutgoingPlayers([]);
      }
      return next;
    });
  });

  const isFading = outgoingPlayers.length > 0;

  const drawnDisplay = withCarrierOnBall(displayPlayers, carrierId, carrierPitchPos)
  const drawnOutgoing = withCarrierOnBall(outgoingPlayers, carrierId, carrierPitchPos)

  return (
    <>
      
      {isFading && (
        <PlayerMarkers players={drawnOutgoing} opacity={1 - fade} />
      )}
      <PlayerMarkers
        players={drawnDisplay}
        opacity={isFading ? fade : 1}
      />
    </>
  );
}
