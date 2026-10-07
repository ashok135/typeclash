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
  const [isFocused, setIsFocused] = useState(false)
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
        setIsFocused(true)
      }
    }
  }, [roomStatus, quoteText])

  // Automatically focus input when race begins or on any keypress
  useEffect(() => {
    if (roomStatus === 'racing') {
      if (inputRef.current) {
        inputRef.current.focus()
        setIsFocused(true)
      }

      const handleGlobalKeyDown = (e) => {
        // If race is active and user is typing, make sure input is focused
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
          setIsFocused(true)
        }
      }

      window.addEventListener('keydown', handleGlobalKeyDown)
      return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [roomStatus])

  // Keep input focused when clicking anywhere inside typing area
  const handleContainerClick = () => {
    if (inputRef.current && roomStatus === 'racing') {
      inputRef.current.focus()
      setIsFocused(true)
    }
  }

  // Handle typing input
  const handleInputChange = (e) => {
    if (roomStatus !== 'racing' || hasFinishedRef.current) return

    const newTyped = e.target.value
    const prevLen = typedText.length
    const currentLen = newTyped.length

    // Keystroke sound feedback
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

    // Calculate correct chars count
    let correctChars = 0
    for (let i = 0; i < newTyped.length; i++) {
      if (newTyped[i] === quoteText[i]) {
        correctChars++
      } else {
        break
      }
    }

    const totalChars = quoteText.length
    const progress = Math.min(100, Math.round((correctChars / totalChars) * 100))

    const now = Date.now()
    const activeStart = startTime || now
    const elapsedMinutes = Math.max(0.01, (now - activeStart) / 60000)
    const currentWpm = Math.round((correctChars / 5) / elapsedMinutes)
    const totalTyped = newTyped.length + errorCount
    const currentAccuracy = totalTyped > 0 ? Math.max(0, Math.round((correctChars / totalTyped) * 100)) : 100

    const isFinished = correctChars >= totalChars && newTyped.length >= totalChars

    if (onProgressUpdate) {
      onProgressUpdate({
        progress,
        wpm: currentWpm,
        accuracy: currentAccuracy,
        typedChars: correctChars,
        finished: isFinished,
      })
    }

    if (isFinished && !hasFinishedRef.current) {
      hasFinishedRef.current = true
      if (onFinishRace) {
        onFinishRace({
          wpm: currentWpm,
          accuracy: currentAccuracy,
          timeSeconds: ((now - activeStart) / 1000).toFixed(1),
        })
      }
    }
  }

  // Calculate live WPM & Accuracy for display
  const liveStats = useMemo(() => {
    if (!startTime || typedText.length === 0) {
      return { wpm: 0, accuracy: 100 }
    }
    let correctChars = 0
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === quoteText[i]) {
        correctChars++
      } else {
        break
      }
    }
    const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000)
    const wpm = Math.round((correctChars / 5) / elapsedMinutes)
    const totalTyped = typedText.length + errorCount
    const accuracy = totalTyped > 0 ? Math.max(0, Math.round((correctChars / totalTyped) * 100)) : 100
    return { wpm, accuracy }
  }, [typedText, errorCount, startTime, quoteText])

  // Split quote into words for proper word-wrapping (Monkeytype style)
  const words = useMemo(() => {
    return quoteText.split(' ')
  }, [quoteText])

  let globalCharIndex = 0

  return (
    <div className="typing-section-wrapper" onClick={handleContainerClick}>
      {/* Real-time HUD Bar */}
      <div className="typing-hud-bar">
        <div className="hud-metric-card speed-card">
          <span className="metric-tag">SPEED</span>
          <div className="metric-number">
            {liveStats.wpm}
            <small>WPM</small>
          </div>
        </div>

        <div className="hud-metric-card acc-card">
          <span className="metric-tag">ACCURACY</span>
          <div className="metric-number">
            {liveStats.accuracy}
            <small>%</small>
          </div>
        </div>

        <div className="hud-progress-container">
          <div className="progress-label-row">
            <span className="metric-tag">RACE COMPLETION</span>
            <span className="progress-percentage">
              {Math.min(100, Math.round((typedText.length / (quoteText.length || 1)) * 100))}%
            </span>
          </div>
          <div className="hud-track-bar">
            <div
              className="hud-track-fill"
              style={{
                width: `${Math.min(100, (typedText.length / (quoteText.length || 1)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="hud-status-badge">
          {roomStatus === 'waiting' && <span className="status-pill pill-waiting">IN LOBBY</span>}
          {roomStatus === 'countdown' && <span className="status-pill pill-countdown">GET READY...</span>}
          {roomStatus === 'racing' && <span className="status-pill pill-racing">🔥 RACING ACTIVE</span>}
          {roomStatus === 'finished' && <span className="status-pill pill-finished">🏁 FINISHED</span>}
        </div>
      </div>

      {/* Main Interactive Typing Arena */}
      <div className={`typing-arena-card ${roomStatus === 'racing' ? 'active-race' : ''}`}>
        {/* Invisible input capturing raw keyboard events without rendering any visible box */}
        <input
          ref={inputRef}
          type="text"
          className="stealth-input"
          value={typedText}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={roomStatus !== 'racing' || hasFinishedRef.current}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Word-by-Word & Character-by-Character Display with Giant Crisp Typography */}
        <div className="words-display-area">
          {words.map((word, wordIdx) => {
            const isLastWord = wordIdx === words.length - 1
            const fullWordWithSpace = isLastWord ? word : word + ' '

            return (
              <span key={wordIdx} className="word-cluster">
                {fullWordWithSpace.split('').map((char) => {
                  const charIdx = globalCharIndex++
                  const isCurrent = charIdx === typedText.length
                  let charStatus = 'untyped'

                  if (charIdx < typedText.length) {
                    charStatus = typedText[charIdx] === char ? 'correct' : 'incorrect'
                  }

                  const isSpace = char === ' '

                  return (
                    <span
                      key={charIdx}
                      className={`target-char char-${charStatus} ${isCurrent ? 'char-target-active' : ''} ${
                        isSpace ? 'char-space' : ''
                      }`}
                    >
                      {/* Active Cursor Caret */}
                      {isCurrent && roomStatus === 'racing' && (
                        <span className="live-typing-caret"></span>
                      )}
                      {isSpace ? '·' : char}
                    </span>
                  )
                })}
              </span>
            )
          })}
        </div>

        {/* Dynamic Interactive Hint */}
        <div className="typing-arena-footer">
          <div className="footer-left-hint">
            {roomStatus === 'racing' && !isFocused ? (
              <span className="click-to-focus-badge">⚠️ Click anywhere to focus & continue typing!</span>
            ) : roomStatus === 'racing' ? (
              <span className="racing-tip">⚡ Green = Correct · Red = Typo · Target letter is highlighted</span>
            ) : roomStatus === 'countdown' ? (
              <span className="countdown-tip">🚦 Hands on the keyboard! Race starts in seconds...</span>
            ) : (
              <span className="waiting-tip">⏳ Waiting for race countdown to start...</span>
            )}
          </div>
          <div className="footer-stats-tag">
            {typedText.length} / {quoteText.length} characters
          </div>
        </div>
      </div>
    </div>
  )
}
