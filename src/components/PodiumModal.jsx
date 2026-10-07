'use client'

import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function PodiumModal({
  players = [],
  currentUserId,
  onRematch,
  onLeave,
  isHost,
}) {
  // Fire victory confetti when podium mounts
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#10b981', '#f59e0b', '#b026ff'],
      })
    } catch (e) {}
  }, [])

  // Sort players by finished status and rank/finishTime or progress
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.finished && b.finished) {
      return (a.rank || 99) - (b.rank || 99)
    }
    if (a.finished) return -1
    if (b.finished) return 1
    return b.progress - a.progress
  })

  const currentPlayer = players.find((p) => p.id === currentUserId)

  return (
    <div className="modal-backdrop">
      <div className="podium-card">
        <div className="podium-glow-accent"></div>

        {/* Header */}
        <div className="podium-header">
          <span className="trophy-icon">🏆</span>
          <h2>RACE FINISHED!</h2>
          <p>
            {currentPlayer?.rank === 1
              ? '🥇 Incredible victory! You took 1st Place on the podium!'
              : currentPlayer?.rank
              ? `Great race! You crossed the finish line in #${currentPlayer.rank} place.`
              : 'Race completed! Check your final stats below.'}
          </p>
        </div>

        {/* Top 3 Podium Visuals (if >= 2 players) */}
        {sortedPlayers.length >= 2 && (
          <div className="podium-stage">
            {/* 2nd Place */}
            {sortedPlayers[1] && (
              <div className="podium-column col-2">
                <div className="podium-car" style={{ color: sortedPlayers[1].car?.color }}>
                  {sortedPlayers[1].car?.symbol || '🏎️'}
                </div>
                <div className="podium-name">{sortedPlayers[1].name}</div>
                <div className="podium-wpm">{sortedPlayers[1].wpm} WPM</div>
                <div className="podium-block block-2">
                  <span>2</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {sortedPlayers[0] && (
              <div className="podium-column col-1">
                <div className="crown-badge">👑</div>
                <div className="podium-car" style={{ color: sortedPlayers[0].car?.color }}>
                  {sortedPlayers[0].car?.symbol || '🏎️'}
                </div>
                <div className="podium-name">{sortedPlayers[0].name}</div>
                <div className="podium-wpm">{sortedPlayers[0].wpm} WPM</div>
                <div className="podium-block block-1">
                  <span>1</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedPlayers[2] && (
              <div className="podium-column col-3">
                <div className="podium-car" style={{ color: sortedPlayers[2].car?.color }}>
                  {sortedPlayers[2].car?.symbol || '🏎️'}
                </div>
                <div className="podium-name">{sortedPlayers[2].name}</div>
                <div className="podium-wpm">{sortedPlayers[2].wpm} WPM</div>
                <div className="podium-block block-3">
                  <span>3</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Leaderboard Table */}
        <div className="leaderboard-list">
          {sortedPlayers.map((player, idx) => {
            const isYou = player.id === currentUserId
            return (
              <div key={player.id} className={`leaderboard-row ${isYou ? 'row-you' : ''}`}>
                <div className="lr-rank">
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${idx + 1}`}
                </div>
                <div className="lr-avatar" style={{ color: player.car?.color }}>
                  {player.car?.symbol || '🏎️'}
                </div>
                <div className="lr-name">
                  {player.name} {isYou && <strong className="you-pill">YOU</strong>}
                </div>
                <div className="lr-stats">
                  <span className="lr-stat-wpm" style={{ color: player.car?.color }}>
                    {player.wpm} <small>WPM</small>
                  </span>
                  <span className="lr-stat-acc">
                    {player.accuracy}% <small>ACC</small>
                  </span>
                  {player.finishTime && (
                    <span className="lr-stat-time">
                      {player.finishTime.toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="podium-actions">
          {isHost ? (
            <button className="btn-primary rematch-btn" onClick={onRematch}>
              🔄 Rematch (New Quote)
            </button>
          ) : (
            <div className="waiting-host-notice">
              ⏳ Waiting for room host to initiate rematch...
            </div>
          )}
          <button className="btn-secondary leave-btn" onClick={onLeave}>
            ◀ Back to Lobby
          </button>
        </div>
      </div>
    </div>
  )
}
