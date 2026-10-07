'use client'

import React from 'react'

export default function RaceTrack({ players = [], currentUserId, isRacing = false }) {
  // Sort or maintain lane order
  return (
    <div className="racetrack-container">
      <div className="track-header">
        <div className="th-left">
          <span className="th-flag">🏁</span>
          <span className="th-title">LIVE RACETRACK</span>
        </div>
        <div className="th-legend">
          <span className="legend-item"><span className="dot you"></span> You</span>
          <span className="legend-item"><span className="dot other"></span> Opponents</span>
        </div>
      </div>

      <div className="track-lanes">
        {players.map((player, index) => {
          const isYou = player.id === currentUserId
          const isFinished = player.finished
          const isNitro = player.wpm > 65 && !isFinished && isRacing

          return (
            <div
              key={player.id}
              className={`track-lane ${isYou ? 'lane-you' : ''} ${isFinished ? 'lane-finished' : ''}`}
            >
              {/* Lane Info Header */}
              <div className="lane-info">
                <div className="lane-player">
                  <span className="lane-num">#{index + 1}</span>
                  <span className="lane-avatar" style={{ color: player.car?.color }}>
                    {player.car?.symbol || '🏎️'}
                  </span>
                  <span className="lane-name">
                    {player.name} {isYou && <strong className="you-badge">(YOU)</strong>}
                  </span>
                </div>

                <div className="lane-stats">
                  <span className="lane-wpm" style={{ color: player.car?.color }}>
                    {player.wpm} <small>WPM</small>
                  </span>
                  <span className="lane-acc">
                    {player.accuracy}%
                  </span>
                  {player.rank && (
                    <span className={`rank-badge rank-${player.rank}`}>
                      {player.rank === 1 ? '🥇 1st' : player.rank === 2 ? '🥈 2nd' : player.rank === 3 ? '🥉 3rd' : `#${player.rank}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Physical Asphalt Track */}
              <div className="road-strip">
                <div className="road-lines"></div>

                {/* The Moving Vehicle */}
                <div
                  className={`car-wrapper ${isNitro ? 'nitro-active' : ''}`}
                  style={{
                    left: `${Math.min(94, Math.max(1, player.progress))}%`,
                    transition: 'left 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  {/* Nitro Jet Flame */}
                  {isNitro && (
                    <div className="nitro-flame" style={{ background: player.car?.gradient }}>
                      <span className="flame-spark"></span>
                    </div>
                  )}

                  {/* Car Vehicle Body */}
                  <div
                    className="car-body"
                    style={{
                      boxShadow: `0 0 16px ${player.car?.glow}`,
                      borderColor: player.car?.color,
                    }}
                  >
                    <span className="car-icon">{player.car?.symbol || '🏎️'}</span>
                  </div>

                  {/* Floating Micro Progress Tooltip */}
                  <div className="car-progress-tip" style={{ borderColor: player.car?.color }}>
                    {Math.round(player.progress)}%
                  </div>
                </div>

                {/* Finish Line Checkered Strip */}
                <div className="finish-line">
                  <span className="finish-flag-icon">🏁</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
