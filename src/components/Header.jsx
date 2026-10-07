'use client'

import React from 'react'

export default function Header({
  room,
  isMuted,
  onToggleSound,
  onLeaveRoom,
}) {
  return (
    <header className="site-header">
      <div className="header-brand" onClick={onLeaveRoom} title="Return to lobby">
        <span className="brand-icon">⚡</span>
        <div className="brand-text">
          <span className="brand-title">TYPE<span>CLASH</span></span>
          <span className="brand-tag">HYPER SPEED MULTIPLAYER</span>
        </div>
      </div>

      <div className="header-actions">
        {room && (
          <div className="room-pill">
            <span className="live-dot"></span>
            <span className="room-label">ROOM:</span>
            <strong className="room-code">{room.code}</strong>
          </div>
        )}

        <button
          className={`sound-btn ${isMuted ? 'muted' : 'active'}`}
          onClick={onToggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {isMuted ? '🔇' : '🔊'}
          <span className="sound-text">{isMuted ? 'Muted' : 'SFX ON'}</span>
        </button>

        {room && (
          <button className="exit-btn" onClick={onLeaveRoom} title="Leave Current Race">
            ✕ Exit
          </button>
        )}
      </div>
    </header>
  )
}
