'use client'

import React, { useMemo } from 'react'
import TopDownCar from './TopDownCar'

export default function RaceTrack({
  players = [],
  currentUserId,
  isRacing = false,
  isTyping = false,
}) {
  // Find current player to determine race-wide leader and user status
  const currentPlayer = useMemo(() => {
    return players.find((p) => p.id === currentUserId)
  }, [players, currentUserId])

  // Sort players for leaderboard rank display while keeping lanes stable
  const rankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (a.finished && !b.finished) return -1
      if (!a.finished && b.finished) return 1
      if (a.finished && b.finished) return (a.rank || 99) - (b.rank || 99)
      return (b.progress || 0) - (a.progress || 0)
    })
  }, [players])

  return (
    <div className="racetrack-super-arena">
      {/* 1. TRACK TOP HUD BAR */}
      <div className="track-hud-bar">
        <div className="hud-circuit-info">
          <span className="circuit-badge">NITRO SPEEDWAY</span>
          <span className="circuit-title">NEON METROPOLIS GRAND PRIX</span>
        </div>
        <div className="hud-race-indicators">
          <div className="hud-tag live-tag">
            <span className="live-blink"></span>
            {isRacing ? 'RACE IN PROGRESS' : 'GRID STAGING'}
          </div>
          <div className="hud-tag racers-count">
            🏁 {players.length} RACERS ON GRID
          </div>
        </div>
      </div>

      {/* 2. MAIN ASPHALT DRAGWAY ARENA */}
      <div className="asphalt-dragway">
        {/* UPPER GUARD RAIL / CRASH BARRIER */}
        <div className="track-guardrail guardrail-top">
          <div className="guardrail-posts"></div>
          <div className="curb-stripes"></div>
        </div>

        {/* OVERHEAD "NITRO CITY" SPEED ARCH (Iconic glowing speed gate) */}
        <div className="overhead-nitro-arch">
          <div className="arch-glow-column">
            <div className="arch-neon-sign">
              <span className="arch-text">NITRO CITY</span>
              <span className="arch-sub">SPEEDWAY</span>
            </div>
            <div className="arch-hazard-stripes"></div>
            <div className="arch-laser-beam"></div>
          </div>
        </div>

        {/* RACING LANES CONTAINER */}
        <div className="highway-lanes-stack">
          {players.map((player, index) => {
            const isYou = player.id === currentUserId
            const isFinished = player.finished
            const playerWpm = player.wpm || 0
            const playerProgress = Math.min(100, Math.max(0, player.progress || 0))
            const playerIsTyping = isYou ? isTyping : playerWpm > 0 && isRacing

            // Dynamic highway motion speed: scroll road marks proportional to WPM
            const scrollDuration = isRacing && playerWpm > 0
              ? `${Math.max(0.3, 2.5 - (playerWpm / 120) * 2.0)}s`
              : '0s'

            // Position car horizontally along lane
            // 0% progress -> 4% track offset (behind start line)
            // 100% progress -> 88% track offset (past finish line)
            const carLeftPercent = 4 + (playerProgress * 0.84)

            // Find current dynamic rank
            const dynamicRank = isFinished
              ? player.rank
              : rankedPlayers.findIndex((p) => p.id === player.id) + 1

            return (
              <div
                key={player.id}
                className={`highway-lane ${isYou ? 'user-lane' : 'rival-lane'} ${
                  isFinished ? 'lane-complete' : ''
                }`}
              >
                {/* A. LEFT-SIDE CHEVRON DRIVER TAG (Matching Nitro Type HUD!) */}
                <div className="driver-chevron-tag">
                  <div className="tag-rank-slot">
                    <span className="rank-label">#{dynamicRank}</span>
                  </div>

                  <div className="tag-details">
                    <div className="driver-name-row">
                      <span className="driver-name" title={player.name}>
                        {player.name}
                      </span>
                      {isYou && <span className="you-pill">YOU</span>}
                      {player.isBot && <span className="bot-pill">BOT</span>}
                    </div>

                    <div className="driver-telemetry">
                      <span className="driver-wpm" style={{ color: player.car?.color || '#00f2fe' }}>
                        <strong>{playerWpm}</strong> <small>WPM</small>
                      </span>
                      <span className="driver-acc">
                        {player.accuracy || 100}%
                      </span>
                      {isFinished && (
                        <span className="finished-tag">
                          {player.rank === 1 ? '🏆 1ST' : player.rank === 2 ? '🥈 2ND' : player.rank === 3 ? '🥉 3RD' : 'DONE'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chevron Right Arrow Cutout */}
                  <div className="chevron-arrow-point"></div>
                </div>

                {/* B. PHYSICAL TARMAC SURFACE */}
                <div className="lane-tarmac">
                  {/* Road Asphalt Texture & Moving Center Dashed Lines */}
                  <div
                    className={`tarmac-road-markings ${isRacing && playerWpm > 0 ? 'road-moving' : ''}`}
                    style={{ animationDuration: scrollDuration }}
                  >
                    <div className="center-dash-line"></div>
                  </div>

                  {/* START LINE (at 4% mark) */}
                  <div className="lane-start-line"></div>

                  {/* CHECKERED FINISH GATE (at 88% mark) */}
                  <div className="lane-finish-gate">
                    <div className="checkered-stripe"></div>
                    <span className="finish-checkered-flag">🏁</span>
                  </div>

                  {/* C. THE RACING VEHICLE ON TRACK */}
                  <div
                    className={`lane-vehicle-tracker ${isYou ? 'vehicle-you' : ''}`}
                    style={{
                      left: `${carLeftPercent}%`,
                      transition: 'left 0.25s cubic-bezier(0.2, 0.85, 0.25, 1)',
                    }}
                  >
                    {/* Glowing Chevron "YOU" Indicator (Matching Nitro Type screenshot!) */}
                    {isYou && (
                      <div className="user-follow-indicator">
                        <div className="chevrons-arrow">
                          <span className="chev-1">‹</span>
                          <span className="chev-2">‹</span>
                          <span className="chev-3">‹</span>
                        </div>
                        <span className="you-callout">YOU</span>
                      </div>
                    )}

                    {/* Top-Down Race Car */}
                    <TopDownCar
                      car={player.car}
                      wpm={playerWpm}
                      isTyping={playerIsTyping}
                      isFinished={isFinished}
                      isYou={isYou}
                      scale={isYou ? 1.05 : 0.95}
                    />

                    {/* Micro Progress Floating Gauge */}
                    <div
                      className="car-distance-marker"
                      style={{ borderColor: player.car?.color || '#00f2fe' }}
                    >
                      {Math.round(playerProgress)}%
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* LOWER GUARD RAIL / CRASH BARRIER */}
        <div className="track-guardrail guardrail-bottom">
          <div className="curb-stripes"></div>
          <div className="guardrail-posts"></div>
        </div>
      </div>
    </div>
  )
}
