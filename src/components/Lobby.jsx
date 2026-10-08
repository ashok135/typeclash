'use client'

import React, { useState } from 'react'
import { CARS } from '@/lib/cars'
import TopDownCar from './TopDownCar'

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
      {/* THE FASTEST FINGERS WIN - HERO SECTION (Matching Landing Page) */}
      <section className="fastest-hero-section">
        {/* Left Column: Hero Copy & Actions */}
        <div className="hero-left-content">
          <div className="hero-pill-badge">
            <span className="sparkle-icon">✨</span>
            <span>Real-time multiplayer typing battles</span>
          </div>

          <h1 className="hero-huge-title">
            The fastest<br />
            <span className="hero-gradient-text">fingers win.</span>
          </h1>

          <p className="hero-description">
            Race opponents live in head-to-head typing duels. Climb the ranks, unlock achievements, and prove your speed with sub-100ms sync.
          </p>

          <div className="hero-actions-row">
            <button
              type="button"
              className="hero-play-btn"
              onClick={() => onSoloPractice('medium')}
              disabled={isCreating}
            >
              <span className="swords-icon">⚔️</span>
              <span>{isCreating ? 'Starting Race...' : 'Play free now'}</span>
              <span className="arrow-icon">›</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => {
                const el = document.getElementById('racer-staging-bay')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="trophy-icon">🏆</span>
              <span>Race with Friends</span>
            </button>
          </div>

          {/* Quick Stats Metrics Row */}
          <div className="hero-stats-row">
            <div className="stat-pill-item">
              <span className="stat-icon">⚡</span>
              <div className="stat-meta">
                <strong className="stat-val">&lt;100ms</strong>
                <span className="stat-sub">Avg latency</span>
              </div>
            </div>

            <div className="stat-pill-item">
              <span className="stat-icon">🤖</span>
              <div className="stat-meta">
                <strong className="stat-val">6 levels</strong>
                <span className="stat-sub">AI tiers</span>
              </div>
            </div>

            <div className="stat-pill-item">
              <span className="stat-icon">🏆</span>
              <div className="stat-meta">
                <strong className="stat-val">11+</strong>
                <span className="stat-sub">Achievements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Match Preview Card */}
        <div className="hero-right-preview">
          <div className="match-preview-card">
            <div className="preview-window-bar">
              <div className="mac-dots">
                <span className="mac-dot red"></span>
                <span className="mac-dot yellow"></span>
                <span className="mac-dot green"></span>
              </div>
              <div className="live-match-indicator">
                <span className="live-pulsing-dot"></span>
                <span>live match</span>
              </div>
            </div>

            {/* Dual Racer Duel Bars */}
            <div className="preview-racers-row">
              <div className="preview-racer-pod you-pod">
                <div className="pod-header">
                  <span className="pod-name">You</span>
                  <span className="pod-wpm">92 <small>wpm</small></span>
                </div>
                <div className="pod-bar-bg">
                  <div className="pod-bar-fill you-fill" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div className="preview-racer-pod aria-pod">
                <div className="pod-header">
                  <span className="pod-name">Aria</span>
                  <span className="pod-wpm">88 <small>wpm</small></span>
                </div>
                <div className="pod-bar-bg">
                  <div className="pod-bar-fill aria-fill" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            {/* Terminal Typing Excerpt Box */}
            <div className="preview-text-box">
              <p className="preview-quote-display">
                <span className="typed-passed">The quick brown fox jumps over the lazy dog while the morni</span>
                <span className="cursor-active">n</span>
                <span className="untyped-letters">g sun paints the sky in shades of amber and violet.</span>
              </p>
            </div>

            {/* Bottom 4 Metric Quadrants */}
            <div className="preview-metrics-grid">
              <div className="preview-metric-box">
                <span className="pm-val">92</span>
                <span className="pm-label">WPM</span>
              </div>
              <div className="preview-metric-box">
                <span className="pm-val">460</span>
                <span className="pm-label">CPM</span>
              </div>
              <div className="preview-metric-box">
                <span className="pm-val">98%</span>
                <span className="pm-label">ACC</span>
              </div>
              <div className="preview-metric-box">
                <span className="pm-val">14s</span>
                <span className="pm-label">TIME</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left = Racer Customization, Right = Mode Selection */}
      <div id="racer-staging-bay" className="lobby-grid">
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
                    <div className="car-preview-slot">
                      <TopDownCar
                        car={car}
                        wpm={isSelected ? 65 : 0}
                        isTyping={isSelected}
                        scale={0.65}
                      />
                    </div>
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
