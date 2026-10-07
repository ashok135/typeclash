'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import Lobby from '@/components/Lobby'
import RoomWaiting from '@/components/RoomWaiting'
import RaceTrack from '@/components/RaceTrack'
import TypingArea from '@/components/TypingArea'
import PodiumModal from '@/components/PodiumModal'
import { CARS } from '@/lib/cars'
import {
  playCountdownBeep,
  playVictoryFanfare,
  playNitroBoost,
  initAudioContext,
} from '@/lib/soundEffects'

export default function Home() {
  // Racer identity state
  const [playerName, setPlayerName] = useState('')
  const [selectedCar, setSelectedCar] = useState(CARS[0].id)
  const [currentUserId, setCurrentUserId] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  // Room state
  const [room, setRoom] = useState(null)
  const [roomCode, setRoomCode] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [isStarting, setIsStarting] = useState(false)

  // Countdown & Race state
  const [countdownNumber, setCountdownNumber] = useState(null)
  const countdownIntervalRef = useRef(null)
  const lastNitroWpmRef = useRef(0)
  const hasPlayedVictoryRef = useRef(false)

  // Initialize player identity from localStorage or fallback
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('typeclash_name')
      if (savedName) {
        setPlayerName(savedName)
      } else {
        const randomNum = Math.floor(100 + Math.random() * 900)
        setPlayerName(`Speedster_${randomNum}`)
      }

      const savedCar = localStorage.getItem('typeclash_car')
      if (savedCar && CARS.some((c) => c.id === savedCar)) {
        setSelectedCar(savedCar)
      }

      const savedMute = localStorage.getItem('typeclash_muted')
      if (savedMute !== null) {
        setIsMuted(savedMute === 'true')
      }
    } catch (e) {
      setPlayerName('Racer_99')
    }

    // Generate a session-stable player ID
    let uid = ''
    try {
      uid = sessionStorage.getItem('typeclash_uid')
      if (!uid) {
        uid = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
        sessionStorage.setItem('typeclash_uid', uid)
      }
    } catch (e) {
      uid = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    }
    setCurrentUserId(uid)

    // Check if URL has ?room=CODE or ?join=CODE
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const codeFromUrl = params.get('room') || params.get('join')
      if (codeFromUrl) {
        // Auto-fill or prompt join in lobby
        setJoinError(`Ready to join room ${codeFromUrl.toUpperCase()}! Click JOIN to enter.`)
      }
    }
  }, [])

  // Save changes to localStorage
  const handleNameChange = (name) => {
    setPlayerName(name)
    try {
      localStorage.setItem('typeclash_name', name)
    } catch (e) {}
  }

  const handleCarChange = (carId) => {
    setSelectedCar(carId)
    try {
      localStorage.setItem('typeclash_car', carId)
    } catch (e) {}
  }

  const handleToggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem('typeclash_muted', String(next))
      } catch (e) {}
      return next
    })
  }

  // --- ROOM POLLING LOOP ---
  const fetchRoomState = useCallback(async (code) => {
    if (!code) return
    try {
      const res = await fetch(`/api/rooms/${code}`)
      if (!res.ok) {
        if (res.status === 404) {
          setJoinError('Room expired or was closed.')
          setRoom(null)
          setRoomCode(null)
        }
        return
      }
      const data = await res.json()
      if (data.room) {
        setRoom(data.room)
      } else if (data.id) {
        setRoom(data)
      }
    } catch (err) {
      console.error('Room poll error:', err)
    }
  }, [])

  useEffect(() => {
    if (!roomCode) return

    // Immediately fetch once
    fetchRoomState(roomCode)

    // Poll interval: faster during racing (400ms) for smooth lane progress, standard (750ms) during waiting
    const isRaceActive = room?.status === 'racing' || room?.status === 'countdown'
    const intervalMs = isRaceActive ? 350 : 700

    const timer = setInterval(() => {
      fetchRoomState(roomCode)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [roomCode, room?.status, fetchRoomState])

  // --- COUNTDOWN HANDLER ---
  useEffect(() => {
    if (!room) return

    // If room is in countdown status and countdown not already ticking
    if (room.status === 'countdown' && countdownNumber === null) {
      initAudioContext()
      let count = 3
      setCountdownNumber(count)
      if (!isMuted) playCountdownBeep(false)

      countdownIntervalRef.current = setInterval(() => {
        count -= 1
        if (count > 0) {
          setCountdownNumber(count)
          if (!isMuted) playCountdownBeep(false)
        } else if (count === 0) {
          setCountdownNumber('GO!')
          if (!isMuted) playCountdownBeep(true)
        } else {
          clearInterval(countdownIntervalRef.current)
          setCountdownNumber(null)
        }
      }, 1000)
    }

    if (room.status !== 'countdown' && countdownNumber !== null) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      setCountdownNumber(null)
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [room?.status, isMuted])

  // Reset victory fanfare tracker when race restarts
  useEffect(() => {
    if (room?.status === 'waiting' || room?.status === 'countdown') {
      hasPlayedVictoryRef.current = false
      lastNitroWpmRef.current = 0
    }
  }, [room?.status])

  // --- ACTIONS ---

  // 1. Create Room
  const handleCreateRoom = async (difficulty) => {
    setIsCreating(true)
    setJoinError('')
    initAudioContext()
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim() || 'Speedster',
          carId: selectedCar,
          difficulty: difficulty || 'Medium',
          userId: currentUserId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create room')
      }

      setRoom(data.room)
      setRoomCode(data.room.code)
      if (data.player?.id) setCurrentUserId(data.player.id)

      // Update URL query param cleanly without reload
      if (typeof window !== 'undefined') {
        const newUrl = `${window.location.pathname}?room=${data.room.code}`
        window.history.replaceState({ path: newUrl }, '', newUrl)
      }
    } catch (err) {
      setJoinError(err.message || 'Error creating room')
    } finally {
      setIsCreating(false)
    }
  }

  // 2. Join Room
  const handleJoinRoom = async (code) => {
    setIsJoining(true)
    setJoinError('')
    initAudioContext()
    try {
      const cleanCode = code.trim().toUpperCase()
      const res = await fetch(`/api/rooms/${cleanCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim() || 'Racer',
          carId: selectedCar,
          userId: currentUserId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Could not join room')
      }

      setRoom(data.room)
      setRoomCode(data.room.code)
      if (data.player?.id) setCurrentUserId(data.player.id)

      if (typeof window !== 'undefined') {
        const newUrl = `${window.location.pathname}?room=${data.room.code}`
        window.history.replaceState({ path: newUrl }, '', newUrl)
      }
    } catch (err) {
      setJoinError(err.message || 'Failed to join room')
    } finally {
      setIsJoining(false)
    }
  }

  // 3. Solo Practice Mode (Immediate AI race)
  const handleSoloPractice = async () => {
    setIsCreating(true)
    setJoinError('')
    initAudioContext()
    try {
      // Create room with Medium difficulty
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim() || 'Solo Pilot',
          carId: selectedCar,
          difficulty: 'Medium',
          userId: currentUserId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const code = data.room.code
      setRoom(data.room)
      setRoomCode(code)
      if (data.player?.id) setCurrentUserId(data.player.id)

      // Add 2 bots for realistic practice competition
      await fetch(`/api/rooms/${code}/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: 'bot-swift' }),
      })
      await fetch(`/api/rooms/${code}/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: 'bot-blaze' }),
      })

      // Start the countdown immediately
      await fetch(`/api/rooms/${code}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: data.player?.id || currentUserId }),
      })
      fetchRoomState(code)
    } catch (err) {
      setJoinError('Error launching Solo Practice: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  // 4. Start Race (Host only)
  const handleStartRace = async () => {
    if (!roomCode) return
    setIsStarting(true)
    initAudioContext()
    try {
      const res = await fetch(`/api/rooms/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: currentUserId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(data.room)
    } catch (err) {
      console.error(err)
    } finally {
      setIsStarting(false)
    }
  }

  // 5. Toggle Ready Status
  const handleToggleReady = async () => {
    if (!roomCode || !currentUserId) return
    const me = room?.players.find((p) => p.id === currentUserId)
    const nextReady = !me?.isReady

    try {
      await fetch(`/api/rooms/${roomCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentUserId,
          isReady: nextReady,
        }),
      })
      fetchRoomState(roomCode)
    } catch (err) {
      console.error(err)
    }
  }

  // 6. Add Bot (Host only)
  const handleAddBot = async () => {
    if (!roomCode) return
    try {
      const res = await fetch(`/api/rooms/${roomCode}/bot`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) setRoom(data.room)
    } catch (err) {
      console.error(err)
    }
  }

  // 7. Live Typing Progress Update
  const handleProgressUpdate = async ({ progress, wpm, accuracy, typedChars }) => {
    if (!roomCode || !currentUserId || room?.status !== 'racing') return

    // Sound effect: Nitro burst when breaking 75 WPM
    if (wpm >= 75 && lastNitroWpmRef.current < 75 && !isMuted) {
      playNitroBoost()
    }
    lastNitroWpmRef.current = wpm

    // Send update to serverless backend
    try {
      await fetch(`/api/rooms/${roomCode}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentUserId,
          progress,
          wpm,
          accuracy,
          typedChars,
          finished: false,
        }),
      })
    } catch (e) {
      // Silently ignore network hiccup during active keystroke typing
    }
  }

  // 8. Player Crosses Finish Line
  const handleFinishRace = async ({ wpm, accuracy, timeSeconds }) => {
    if (!roomCode || !currentUserId) return

    if (!hasPlayedVictoryRef.current && !isMuted) {
      playVictoryFanfare()
      hasPlayedVictoryRef.current = true
    }

    try {
      const res = await fetch(`/api/rooms/${roomCode}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentUserId,
          progress: 100,
          wpm,
          accuracy,
          finished: true,
        }),
      })
      const data = await res.json()
      if (res.ok) setRoom(data.room)
    } catch (err) {
      console.error(err)
    }
  }

  // 9. Rematch
  const handleRematch = async () => {
    if (!roomCode) return
    try {
      const res = await fetch(`/api/rooms/${roomCode}/rematch`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setRoom(data.room)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 10. Leave Room / Return to Lobby
  const handleLeaveRoom = () => {
    setRoom(null)
    setRoomCode(null)
    setCountdownNumber(null)
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }

  // Derive visual game state
  const isHost = room?.players.some((p) => p.id === currentUserId && p.isHost)
  const isRacing = room?.status === 'racing'
  const isWaiting = room?.status === 'waiting'
  const isCountdown = room?.status === 'countdown'
  const isFinished = room?.status === 'finished'

  return (
    <div className="app-container">
      {/* Universal Cyber Header */}
      <Header
        room={room}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onLeaveRoom={room ? handleLeaveRoom : null}
      />

      <main className="main-content">
        {/* VIEW 1: LOBBY */}
        {!room && (
          <Lobby
            playerName={playerName}
            setPlayerName={handleNameChange}
            selectedCar={selectedCar}
            setSelectedCar={handleCarChange}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onSoloPractice={handleSoloPractice}
            isCreating={isCreating}
            isJoining={isJoining}
            joinError={joinError}
          />
        )}

        {/* VIEW 2: ROOM WAITING ROOM */}
        {room && isWaiting && (
          <RoomWaiting
            room={room}
            currentUserId={currentUserId}
            onStartRace={handleStartRace}
            onToggleReady={handleToggleReady}
            onAddBot={handleAddBot}
            isStarting={isStarting}
          />
        )}

        {/* VIEW 3: ACTIVE RACE OR COUNTDOWN (Track + Live Typing Field) */}
        {room && (isCountdown || isRacing || isFinished) && (
          <div className="race-arena">
            {/* Live Multi-Lane Racetrack */}
            <RaceTrack
              players={room.players}
              currentUserId={currentUserId}
              isRacing={isRacing}
            />

            {/* Typing Test Area */}
            <TypingArea
              quoteText={room.quote.text}
              roomStatus={room.status}
              isMuted={isMuted}
              onProgressUpdate={handleProgressUpdate}
              onFinishRace={handleFinishRace}
            />
          </div>
        )}

        {/* FULLSCREEN COUNTDOWN OVERLAY */}
        {countdownNumber !== null && (
          <div className="countdown-overlay">
            <div className="countdown-content">
              <span className="countdown-label">GET READY TO CLASH</span>
              <div className="countdown-number">{countdownNumber}</div>
              <span className="countdown-hint">Keep hands on keyboard!</span>
            </div>
          </div>
        )}

        {/* PODIUM & LEADERBOARD MODAL */}
        {room && isFinished && (
          <PodiumModal
            players={room.players}
            currentUserId={currentUserId}
            onRematch={handleRematch}
            onLeave={handleLeaveRoom}
            isHost={isHost}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>
          TypeClash ⚡ Realtime Typing Race · Built for high speed multiplayer on Vercel · Press keys to race
        </p>
      </footer>
    </div>
  )
}
