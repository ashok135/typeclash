'use client'

import React from 'react'
import InviteShare from './InviteShare'

export default function RoomWaiting({
  room,
  currentUserId,
  onStartRace,
  onToggleReady,
  onAddBot,
  isStarting,
}) {
  const isHost = room.players.find((p) => p.id === currentUserId)?.isHost
  const currentPlayer = room.players.find((p) => p.id === currentUserId)

  return (
    <div className="room-waiting-container">
      {/* Invite Code & Link Header */}
      <InviteShare roomCode={room.code} />

      {/* Quote Info Banner */}
      <div className="quote-preview-card">
        <div className="qp-badge">
          <span>📜</span>
          <span>{room.quote.category.toUpperCase()} · {room.quote.difficulty.toUpperCase()}</span>
        </div>
        <p className="qp-text">
          "{room.quote.text.substring(0, 120)}..."
        </p>
        <span className="qp-count">
          Approx {room.quote.text.split(' ').length} words
        </span>
      </div>

      {/* Racers Grid */}
      <div className="racers-section">
        <div className="racers-header">
          <h3>
            RACERS ON THE GRID ({room.players.length} / 8)
          </h3>
          {isHost && room.players.length < 8 && (
            <button
              type="button"
              className="add-bot-btn"
              onClick={onAddBot}
              title="Add an AI racer for extra competition"
            >
              + Add AI Bot Racer
            </button>
          )}
        </div>

        <div className="racers-grid">
          {room.players.map((player) => {
            const isYou = player.id === currentUserId

            return (
              <div
                key={player.id}
                className={`racer-card ${isYou ? 'racer-you' : ''}`}
                style={{ borderColor: player.car?.color }}
              >
                <div className="rc-avatar-box" style={{ background: player.car?.gradient }}>
                  <span className="rc-avatar-icon">{player.car?.symbol || '🏎️'}</span>
                </div>

                <div className="rc-info">
                  <div className="rc-name-row">
                    <strong className="rc-name">{player.name}</strong>
                    {isYou && <span className="rc-you-tag">YOU</span>}
                    {player.isHost && <span className="rc-host-tag">HOST</span>}
                    {player.isBot && <span className="rc-bot-tag">AI</span>}
                  </div>
                  <span className="rc-car-name" style={{ color: player.car?.color }}>
                    {player.car?.name}
                  </span>
                </div>

                <div className="rc-status">
                  {player.isReady ? (
                    <span className="rc-ready-badge">READY ✓</span>
                  ) : (
                    <span className="rc-waiting-badge">WAITING...</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Control Deck */}
      <div className="waiting-actions-deck">
        {isHost ? (
          <div className="host-deck">
            <button
              className="btn-primary start-countdown-btn"
              onClick={onStartRace}
              disabled={isStarting}
            >
              {isStarting ? 'Initiating...' : '🚦 START RACE COUNTDOWN'}
            </button>
            <p className="deck-hint">
              {room.players.length === 1
                ? '💡 You can start solo or add AI bots anytime, or wait for friends to join with your code.'
                : 'All players will enter the 3-2-1 countdown simultaneously!'}
            </p>
          </div>
        ) : (
          <div className="guest-deck">
            <button
              className={`ready-toggle-btn ${currentPlayer?.isReady ? 'is-ready' : ''}`}
              onClick={onToggleReady}
            >
              {currentPlayer?.isReady ? '✓ YOU ARE READY' : 'CLICK WHEN READY'}
            </button>
            <p className="deck-hint">
              Waiting for the host to ignite the starting lights...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
