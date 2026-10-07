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
  const [activeTab, setActiveTab] = useState('create') // 'create' | 'join'
  const [joinCode, setJoinCode] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')

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
      {/* Hero Welcome Banner */}
      <div className="lobby-hero">
        <div className="hero-pill">
          <span className="pill-dot"></span>
          <span>ONLINE MULTIPLAYER RACING</span>
        </div>
        <h1 className="hero-title">
          BATTLE YOUR FRIENDS IN <span>REALTIME TYPING RACES</span>
        </h1>
        <p className="hero-subtitle">
          Type lightning-fast, ignite your nitro speed trails, and cross the finish line first.
          Create a room, send the invite code, and see who is the fastest on the keyboard!
        </p>
      </div>

      <div className="lobby-grid">
        {/* Left Column: Player Identity & Vehicle Selection */}
        <div className="lobby-card player-setup-card">
          <div className="card-header">
            <span className="card-badge">STEP 1</span>
            <h3>CHOOSE YOUR RACER PROFILE</h3>
          </div>

          <div className="form-group">
            <label className="field-label">RACER CALLSIGN / NAME</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="text-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={18}
                placeholder="Enter your racer name..."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">SELECT RACE VEHICLE</label>
            <div className="car-selection-grid">
              {CARS.map((car) => {
                const isSelected = selectedCar.id === car.id
                return (
                  <button
                    key={car.id}
                    type="button"
                    className={`car-select-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedCar(car)}
                    style={{
                      borderColor: isSelected ? car.color : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected ? `0 0 15px ${car.glow}` : 'none',
                    }}
                  >
                    <div className="car-icon-large" style={{ color: car.color }}>
                      {car.symbol}
                    </div>
                    <div className="car-meta">
                      <span className="car-name">{car.name}</span>
                    </div>
                    {isSelected && <span className="car-checked-badge">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Game Modes (Create / Join / Solo) */}
        <div className="lobby-card game-modes-card">
          <div className="card-header">
            <span className="card-badge">STEP 2</span>
            <h3>CHOOSE RACE MODE</h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mode-tabs">
            <button
              className={`mode-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              🏁 Create Challenge
            </button>
            <button
              className={`mode-tab-btn ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => setActiveTab('join')}
            >
              🔑 Join with Code
            </button>
          </div>

          {/* Tab 1: Create Challenge Room */}
          {activeTab === 'create' && (
            <form className="tab-content" onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="field-label">QUOTE DIFFICULTY</label>
                <div className="difficulty-pills">
                  {['Easy', 'Medium', 'Hard', 'All'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      className={`diff-pill ${difficulty === diff ? 'active' : ''}`}
                      onClick={() => setDifficulty(diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mode-perks">
                <div className="perk-item">
                  <span>✓</span> Generates instant 5-character room code
                </div>
                <div className="perk-item">
                  <span>✓</span> 1-click shareable invite link for friends
                </div>
                <div className="perk-item">
                  <span>✓</span> Supports 2 to 8 racers with live visual lanes
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary create-room-btn"
                disabled={isCreating}
              >
                {isCreating ? 'Creating Room...' : '🚀 Create Race Room'}
              </button>
            </form>
          )}

          {/* Tab 2: Join with Code */}
          {activeTab === 'join' && (
            <form className="tab-content" onSubmit={handleJoinSubmit}>
              <div className="form-group">
                <label className="field-label">ENTER 5-LETTER ROOM CODE</label>
                <input
                  type="text"
                  className="code-input"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="e.g. RACE7"
                  required
                />
              </div>

              {joinError && <div className="error-banner">⚠️ {joinError}</div>}

              <button
                type="submit"
                className="btn-primary join-room-btn"
                disabled={isJoining || !joinCode.trim()}
              >
                {isJoining ? 'Joining...' : '⚡ Join Race'}
              </button>
            </form>
          )}

          {/* Solo Practice Option */}
          <div className="solo-practice-box">
            <div className="sp-text">
              <strong>Want to test right now?</strong>
              <span>Hop into an instant solo race with competitive AI bots!</span>
            </div>
            <button
              type="button"
              className="btn-secondary solo-btn"
              onClick={onSoloPractice}
            >
              🤖 Practice vs Bots
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
