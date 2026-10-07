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
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [totalKeypresses, setTotalKeypresses] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const hasFinishedRef = useRef(false)

  // Split quote into distinct words
  const words = useMemo(() => {
    return quoteText ? quoteText.trim().split(/\s+/) : []
  }, [quoteText])

  const targetWord = words[currentWordIdx] || ''
  const isLastWord = currentWordIdx === words.length - 1

  // Reset state when quote or room status resets
  useEffect(() => {
    if (roomStatus === 'waiting' || roomStatus === 'countdown') {
      setCurrentWordIdx(0)
      setCurrentInput('')
      setErrorCount(0)
      setTotalKeypresses(0)
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

  // Focus input automatically whenever race is active
  useEffect(() => {
    if (roomStatus === 'racing') {
      if (inputRef.current) {
        inputRef.current.focus()
        setIsFocused(true)
      }

      const handleGlobalKeyDown = (e) => {
        // If not already focused, refocus when pressing any typing key
        if (inputRef.current && document.activeElement !== inputRef.current) {
          if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
            inputRef.current.focus()
            setIsFocused(true)
          }
        }
      }

      window.addEventListener('keydown', handleGlobalKeyDown)
      return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [roomStatus])

  // Click container to refocus input
  const handleContainerClick = () => {
    if (inputRef.current && roomStatus === 'racing') {
      inputRef.current.focus()
      setIsFocused(true)
    }
  }

  // Calculate total completed characters across words
  const getCompletedCharsCount = (wordIdx, currentVal) => {
    let count = 0
    for (let i = 0; i < wordIdx; i++) {
      count += words[i].length + 1 // +1 for the space
    }
    // Add correct characters typed in current word
    if (targetWord && currentVal) {
      for (let j = 0; j < currentVal.length; j++) {
        if (currentVal[j] === targetWord[j]) {
          count++
        } else {
          break
        }
      }
    }
    return count
  }

  // Handle typing input
  const handleInputChange = (e) => {
    if (roomStatus !== 'racing' || hasFinishedRef.current) return

    const val = e.target.value
    const now = Date.now()
    const activeStart = startTime || now
    setTotalKeypresses((prev) => prev + 1)

    // Check if user hit spacebar to commit the word
    if (val.endsWith(' ')) {
      const trimmedVal = val.trim()

      if (trimmedVal === targetWord) {
        // Correct word completed!
        playKeyClick(isMuted)

        const nextWordIdx = currentWordIdx + 1
        setCurrentWordIdx(nextWordIdx)
        setCurrentInput('')

        // Calculate progress
        const completedChars = getCompletedCharsCount(nextWordIdx, '')
        const totalChars = quoteText.length
        const progress = Math.min(100, Math.round((completedChars / totalChars) * 100))

        const elapsedMinutes = Math.max(0.01, (now - activeStart) / 60000)
        const currentWpm = Math.round((completedChars / 5) / elapsedMinutes)
        const accuracy = totalKeypresses > 0 ? Math.max(0, Math.round(((completedChars) / totalKeypresses) * 100)) : 100

        if (onProgressUpdate) {
          onProgressUpdate({
            progress,
            wpm: currentWpm,
            accuracy,
            typedChars: completedChars,
            finished: false,
          })
        }
        return
      } else {
        // Space pressed prematurely or with typo
        playKeyError(isMuted)
        setErrorCount((prev) => prev + 1)
        setCurrentInput(val)
        return
      }
    }

    // Check if the final word was completed (no space required for last word)
    if (isLastWord && val === targetWord) {
      playKeyClick(isMuted)
      setCurrentInput(val)
      hasFinishedRef.current = true

      const completedChars = quoteText.length
      const elapsedMinutes = Math.max(0.01, (now - activeStart) / 60000)
      const currentWpm = Math.round((completedChars / 5) / elapsedMinutes)
      const accuracy = totalKeypresses > 0 ? Math.max(0, Math.round((completedChars / (totalKeypresses + 1)) * 100)) : 100

      if (onProgressUpdate) {
        onProgressUpdate({
          progress: 100,
          wpm: currentWpm,
          accuracy,
          typedChars: completedChars,
          finished: true,
        })
      }

      if (onFinishRace) {
        onFinishRace({
          wpm: currentWpm,
          accuracy,
          timeSeconds: ((now - activeStart) / 1000).toFixed(1),
        })
      }
      return
    }

    // Normal keystroke within the current word
    const isTypo = !targetWord.startsWith(val)
    if (isTypo) {
      playKeyError(isMuted)
      setErrorCount((prev) => prev + 1)
    } else {
      playKeyClick(isMuted)
    }

    setCurrentInput(val)

    // Update real-time progress & WPM
    const completedChars = getCompletedCharsCount(currentWordIdx, val)
    const totalChars = quoteText.length
    const progress = Math.min(100, Math.round((completedChars / totalChars) * 100))
    const elapsedMinutes = Math.max(0.01, (now - activeStart) / 60000)
    const currentWpm = Math.round((completedChars / 5) / elapsedMinutes)
    const accuracy = totalKeypresses > 0 ? Math.max(0, Math.round((completedChars / totalKeypresses) * 100)) : 100

    if (onProgressUpdate) {
      onProgressUpdate({
        progress,
        wpm: currentWpm,
        accuracy,
        typedChars: completedChars,
        finished: false,
      })
    }
  }

  // Check if current input has a typo
  const hasTypo = currentInput.length > 0 && !targetWord.startsWith(currentInput)

  // Calculate live stats
  const liveStats = useMemo(() => {
    if (!startTime) return { wpm: 0, accuracy: 100 }
    const completedChars = getCompletedCharsCount(currentWordIdx, currentInput)
    const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000)
    const wpm = Math.round((completedChars / 5) / elapsedMinutes)
    const accuracy = totalKeypresses > 0 ? Math.max(0, Math.round((completedChars / totalKeypresses) * 100)) : 100
    return { wpm, accuracy }
  }, [currentWordIdx, currentInput, startTime, totalKeypresses])

  return (
    <div className="typeracer-arena-wrapper" onClick={handleContainerClick}>
      {/* HUD Header Bar */}
      <div className="typeracer-hud">
        <div className="hud-metric-tile wpm-tile">
          <span className="metric-caption">SPEED</span>
          <div className="metric-val">
            <strong>{liveStats.wpm}</strong>
            <small>WPM</small>
          </div>
        </div>

        <div className="hud-metric-tile acc-tile">
          <span className="metric-caption">ACCURACY</span>
          <div className="metric-val">
            <strong>{liveStats.accuracy}</strong>
            <small>%</small>
          </div>
        </div>

        <div className="hud-metric-tile progress-tile">
          <div className="progress-text-row">
            <span className="metric-caption">PROGRESS</span>
            <span className="word-count-tag">
              Word {Math.min(currentWordIdx + 1, words.length)} of {words.length}
            </span>
          </div>
          <div className="hud-progress-track">
            <div
              className="hud-progress-bar-fill"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((getCompletedCharsCount(currentWordIdx, currentInput) / (quoteText.length || 1)) * 100)
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="hud-status-chip">
          {roomStatus === 'waiting' && <span className="chip waiting">IN LOBBY</span>}
          {roomStatus === 'countdown' && <span className="chip countdown">STARTING...</span>}
          {roomStatus === 'racing' && <span className="chip racing">🔥 RACING</span>}
          {roomStatus === 'finished' && <span className="chip finished">🏁 FINISHED</span>}
        </div>
      </div>

      {/* Target Quote Display Box */}
      <div className="typeracer-quote-box">
        <div className="quote-text-stream">
          {words.map((word, idx) => {
            const isCompleted = idx < currentWordIdx
            const isCurrent = idx === currentWordIdx
            const isUpcoming = idx > currentWordIdx

            return (
              <span
                key={idx}
                className={`stream-word ${
                  isCompleted ? 'word-completed' : ''
                } ${isCurrent ? 'word-current' : ''} ${isUpcoming ? 'word-upcoming' : ''}`}
              >
                {/* Render current word with character-level accuracy */}
                {isCurrent ? (
                  <span className="current-word-wrapper">
                    {word.split('').map((char, charIndex) => {
                      let charClass = 'char-pending'
                      if (charIndex < currentInput.length) {
                        charClass = currentInput[charIndex] === char ? 'char-correct' : 'char-error'
                      }
                      return (
                        <span key={charIndex} className={`active-char ${charClass}`}>
                          {char}
                        </span>
                      )
                    })}
                  </span>
                ) : (
                  word
                )}
                {' '}
              </span>
            )
          })}
        </div>
      </div>

      {/* Prominent, Dedicated TypeRacer Input Box */}
      <div className={`typeracer-input-container ${hasTypo ? 'state-error' : 'state-normal'}`}>
        <div className="input-prefix-icon">
          {hasTypo ? '⚠️' : '⌨️'}
        </div>

        <input
          ref={inputRef}
          type="text"
          className={`typeracer-input-field ${hasTypo ? 'input-error' : ''}`}
          value={currentInput}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={roomStatus !== 'racing' || hasFinishedRef.current}
          placeholder={
            roomStatus === 'racing'
              ? `Type "${targetWord}" then press space...`
              : roomStatus === 'countdown'
              ? 'Get ready to type...'
              : 'Waiting for race start...'
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <div className="input-hint-badge">
          {hasTypo ? (
            <span className="hint-fix-typo">Press Backspace to fix typo!</span>
          ) : isLastWord ? (
            <span className="hint-finish">Final word! Type it to cross the finish line!</span>
          ) : (
            <span className="hint-space">Hit [SPACE] after each word</span>
          )}
        </div>
      </div>
    </div>
  )
}
