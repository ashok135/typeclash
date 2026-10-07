'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { playKeyClick, playKeyError } from '@/lib/soundEffects'

export default function TypingArea({
  quoteText = '',
  roomStatus = 'waiting',
  isMuted = false,
  onProgressUpdate,
  onFinishRace,
}) {
  const [typedText, setTypedText] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const inputRef = useRef(null)
  const hasFinishedRef = useRef(false)

  // Reset state when quote or room status resets
  useEffect(() => {
    if (roomStatus === 'waiting' || roomStatus === 'countdown') {
      setTypedText('')
      setErrorCount(0)
      setStartTime(null)
      hasFinishedRef.current = false
    } else if (roomStatus === 'racing' && !startTime) {
      setStartTime(Date.now())
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [roomStatus, quoteText])

  // Focus input automatically whenever racing
  useEffect(() => {
    if (roomStatus === 'racing' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [roomStatus])

  // Keep input focused when clicking anywhere inside typing area
  const handleContainerClick = () => {
    if (inputRef.current && roomStatus === 'racing') {
      inputRef.current.focus()
    }
  }

  // Handle typing input
  const handleInputChange = (e) => {
    if (roomStatus !== 'racing' || hasFinishedRef.current) return

    const newTyped = e.target.value
    const prevLen = typedText.length
    const currentLen = newTyped.length

    // If user typed a new character (not backspace)
    if (currentLen > prevLen) {
      const charTyped = newTyped[currentLen - 1]
      const expectedChar = quoteText[currentLen - 1]

      if (charTyped === expectedChar) {
        playKeyClick(isMuted)
      } else {
        playKeyError(isMuted)
        setErrorCount((prev) => prev + 1)
      }
    }

    setTypedText(newTyped)

    // Calculate real-time stats
    const correctChars = countCorrectChars(newTyped, quoteText)
    const totalChars = quoteText.length
    const progress = Math.min(100, (correctChars / totalChars) * 100)

    const now = Date.now()
    const activeStart = startTime || now
    const elapsedMinutes = Math.max(0.01, (now - activeStart) / 60000)
    const currentWpm = Math.round((correctChars / 5) / elapsedMinutes)
    const totalTyped = newTyped.length + errorCount
    const currentAccuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100

    const isFinished = correctChars === totalChars

    if (onProgressUpdate) {
      onProgressUpdate({
        progress,
        wpm: currentWpm,
        accuracy: currentAccuracy,
        finished: isFinished,
      })
    }

    if (isFinished && !hasFinishedRef.current) {
      hasFinishedRef.current = true
      if (onFinishRace) {
        onFinishRace({
          wpm: currentWpm,
          accuracy: currentAccuracy,
          time: ((now - activeStart) / 1000).toFixed(1),
        })
      }
    }
  }

  const countCorrectChars = (typed, target) => {
    let count = 0
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) {
        count++
      } else {
        break // Require continuous match for progress
      }
    }
    return count
  }

  // Calculate live WPM & Accuracy for display
  const liveStats = useMemo(() => {
    if (!startTime || typedText.length === 0) {
      return { wpm: 0, accuracy: 100 }
    }
    const correctChars = countCorrectChars(typedText, quoteText)
    const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000)
    const wpm = Math.round((correctChars / 5) / elapsedMinutes)
    const totalTyped = typedText.length + errorCount
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100
    return { wpm, accuracy }
  }, [typedText, errorCount, startTime, quoteText])

  return (
    <div className="typing-section" onClick={handleContainerClick}>
      {/* Real-time HUD Bar */}
      <div className="typing-hud">
        <div className="hud-metric">
          <span className="metric-label">LIVE SPEED</span>
          <span className="metric-val speed-val">
            {liveStats.wpm} <small>WPM</small>
          </span>
        </div>

        <div className="hud-metric">
          <span className="metric-label">ACCURACY</span>
          <span className="metric-val acc-val">
            {liveStats.accuracy} <small>%</small>
          </span>
        </div>

        <div className="hud-metric">
          <span className="metric-label">PROGRESS</span>
          <span className="metric-val prog-val">
            {Math.round((typedText.length / (quoteText.length || 1)) * 100)} <small>%</small>
          </span>
        </div>

        <div className="hud-status">
          {roomStatus === 'waiting' && <span className="status-badge waiting">READY IN LOBBY</span>}
          {roomStatus === 'countdown' && <span className="status-badge countdown">GET READY...</span>}
          {roomStatus === 'racing' && <span className="status-badge racing">🔥 RACE ACTIVE!</span>}
          {roomStatus === 'finished' && <span className="status-badge finished">🏁 RACE COMPLETED</span>}
        </div>
      </div>

      {/* Interactive Text Display Card */}
      <div className="typing-card">
        {/* Hidden active input catching keystrokes */}
        <input
          ref={inputRef}
          type="text"
          className="hidden-typing-input"
          value={typedText}
          onChange={handleInputChange}
          disabled={roomStatus !== 'racing' || hasFinishedRef.current}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Character-by-character styled paragraph */}
        <div className="quote-display-container">
          {quoteText.split('').map((char, index) => {
            let status = 'untyped'
            const isCurrent = index === typedText.length

            if (index < typedText.length) {
              status = typedText[index] === char ? 'correct' : 'incorrect'
            }

            return (
              <span
                key={index}
                className={`type-char char-${status} ${isCurrent ? 'char-active' : ''}`}
              >
                {isCurrent && <span className="type-caret"></span>}
                {char}
              </span>
            )
          })}
        </div>

        {/* Click anywhere to focus hint */}
        <div className="typing-hint">
          {roomStatus === 'racing'
            ? '💡 Keep typing — maintain steady rhythm for maximum WPM and Nitro boost!'
            : roomStatus === 'countdown'
            ? '🚦 Engines revving! Place your fingers on the home row...'
            : '⏳ Waiting for host to initiate the countdown...'}
        </div>
      </div>
    </div>
  )
}
