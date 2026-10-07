'use client'

import React, { useState } from 'react'
import { CARS } from '@/lib/cars'

export default function Lobby({
  playerName,
  setPlayerName,
  selectedCar,
  setSelectedCar,
  onCreateRoom,
  onJoinRoom,
  onSoloPractice,
  isCreating,
  isJoining,
  joinError,
}) {
  // 'solo' | 'friends'
  const [primaryMode, setPrimaryMode] = useState('friends')
  // 'create' | 'join' (inside friends mode)
  const [friendTab, setFriendTab] = useState('create')
  const [joinCode, setJoinCode] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')

  // Find selected car object
  const selectedCarObj = CARS.find((c) => c.id === selectedCar || c.id === selectedCar?.id) || CARS[0]

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    if (joinCode.trim()) {
      onJoinRoom(joinCode.trim().toUpperCase())
    }
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    onCreateRoom(difficulty)
  }

  return (
    <div className="lobby-wrapper">
      {/* Hero Banner */}
      <div className="lobby-hero">
        <div className="hero-pill">
          <span className="pill-dot"></span>
          <span>HIGH-OCTANE MULTIPLAYER & SOLO TYPING RACE</span>
        </div>
        <h1 className="hero-title">
          TYPE FAST. <span>RACE LIVE.</span> WIN GLORY.
        </h1>
        <p className="hero-subtitle">
          Battle friends on real-time multi-lane racetracks or sharpen your WPM in solo practice against adaptive AI racers.
        </p>
      </div>

      {/* Main Grid: Left = Racer Customization, Right = Mode Selection */}
      <div className="lobby-grid">
        {/* LEFT COLUMN: RACER PROFILE & VEHICLE */}
        <div className="lobby-card player-setup-card">
          <div className="card-header">
            <span className="card-badge">STEP 1</span>
            <h3>RACER CUSTOMIZATION</h3>
          </div>

          <div className="form-group">
            <label className="field-label">PILOT CALLSIGN</label>
            <div className="input-wrap">
              <span className="input-icon">⚡</span>
              <input
                type="text"
                className="styled-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={18}
                placeholder="Enter pilot name..."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="vehicle-header">
              <label className="field-label">SELECT YOUR MACHINE</label>
              <span className="selected-car-tag" style={{ color: selectedCarObj.color }}>
                {selectedCarObj.name}
              </span>
            </div>

            <div className="cars-grid">
              {CARS.map((car) => {
                const isSelected = selectedCarObj.id === car.id

                return (
                  <button
                    key={car.id}
                    type="button"
                    className={`car-card ${isSelected ? 'car-selected' : ''}`}
                    onClick={() => setSelectedCar(car.id)}
                    style={{
                      '--car-color': car.color,
                      '--car-glow': car.glow,
                    }}
                  >
                    <div className="car-symbol">{car.symbol}</div>
                    <div className="car-name">{car.name}</div>
                    {isSelected && <span className="car-active-dot"></span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GAME MODE SELECTOR */}
        <div className="lobby-card game-modes-card">
          <div className="card-header">
            <span className="card-badge">STEP 2</span>
            <h3>CHOOSE RACE MODE</h3>
          </div>

          {/* Primary Mode Toggle: Solo vs Friends */}
          <div className="primary-mode-tabs">
            <button
              type="button"
              className={`primary-tab-btn ${primaryMode === 'friends' ? 'active' : ''}`}
              onClick={() => setPrimaryMode('friends')}
            >
              👥 Race With Friends
            </button>
            <button
              type="button"
              className={`primary-tab-btn ${primaryMode === 'solo' ? 'active' : ''}`}
              onClick={() => setPrimaryMode('solo')}
            >
              🤖 Solo Practice
            </button>
          </div>

          {/* MODE 1: SOLO PRACTICE */}
          {primaryMode === 'solo' && (
            <div className="mode-panel solo-panel">
              <div className="solo-hero-box">
                <div className="solo-icon-badge">🏎️💨</div>
                <h4>Instant Solo Speed Run</h4>
                <p>
                  Race against competitive AI bots that simulate 60–90 WPM opponents.
                  Zero lobby wait — lights go green immediately!
                </p>
              </div>

              <div className="mode-features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Real-time adaptive AI pacing</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Instant WPM & Accuracy benchmarking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Mechanical key sounds & victory fanfare</span>
                </div>
              </div>

              <button
                type="button"
                className="cta-btn solo-launch-btn"
                onClick={onSoloPractice}
                disabled={isCreating}
              >
                {isCreating ? 'Launching Grid...' : '⚡ Launch Solo Race Now'}
              </button>
            </div>
          )}

          {/* MODE 2: MULTIPLAYER FRIENDS (CREATE OR JOIN) */}
          {primaryMode === 'friends' && (
            <div className="mode-panel friends-panel">
              {/* Secondary Sub-tabs: Create Room vs Join Code */}
              <div className="sub-mode-tabs">
                <button
                  type="button"
                  className={`sub-tab-btn ${friendTab === 'create' ? 'active' : ''}`}
                  onClick={() => setFriendTab('create')}
                >
                  ➕ Create Room
                </button>
                <button
                  type="button"
                  className={`sub-tab-btn ${friendTab === 'join' ? 'active' : ''}`}
                  onClick={() => setFriendTab('join')}
                >
                  🔑 Enter Code
                </button>
              </div>

              {/* TAB 1: CREATE ROOM */}
              {friendTab === 'create' && (
                <form className="sub-tab-content" onSubmit={handleCreateSubmit}>
                  <div className="form-group">
                    <label className="field-label">QUOTE COMPLEXITY</label>
                    <div className="difficulty-pills">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          className={`diff-pill-btn ${difficulty === diff ? 'active' : ''}`}
                          onClick={() => setDifficulty(diff)}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mode-features-list">
                    <div className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>5-character private room code for friends</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>1-click shareable direct invite link</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Realtime lanes for up to 8 racers</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cta-btn create-room-btn"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating Room...' : '🚀 Create Room & Invite Friends'}
                  </button>
                </form>
              )}

              {/* TAB 2: JOIN WITH CODE */}
              {friendTab === 'join' && (
                <form className="sub-tab-content" onSubmit={handleJoinSubmit}>
                  <div className="form-group">
                    <label className="field-label">ENTER 5-CHARACTER ROOM CODE</label>
                    <div className="code-input-wrap">
                      <input
                        type="text"
                        className="room-code-input"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={5}
                        placeholder="e.g. YP2XA"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {joinError && (
                    <div className="error-alert">
                      <span>⚠️</span>
                      <span>{joinError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="cta-btn join-room-btn"
                    disabled={isJoining || joinCode.trim().length === 0}
                  >
                    {isJoining ? 'Joining Grid...' : '⚡ Enter Race Room'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
