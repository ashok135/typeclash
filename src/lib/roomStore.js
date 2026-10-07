import { getRandomQuote } from './quotes'
import { getRandomCar, CARS } from './cars'

// Global singleton map to survive hot-reloads and container reuse
if (!globalThis._typeClashRooms) {
  globalThis._typeClashRooms = new Map()
}

const rooms = globalThis._typeClashRooms

// Clean up stale rooms older than 2 hours
const cleanStaleRooms = () => {
  const now = Date.now()
  const TWO_HOURS = 2 * 60 * 60 * 1000
  for (const [code, room] of rooms.entries()) {
    if (now - room.updatedAt > TWO_HOURS) {
      rooms.delete(code)
    }
  }
}

// Generate human-friendly 5-letter race codes
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const createRoom = ({ hostName, carId, quoteDifficulty, quoteId }) => {
  cleanStaleRooms()

  let code = generateRoomCode()
  while (rooms.has(code)) {
    code = generateRoomCode()
  }

  const quote = getRandomQuote(quoteDifficulty)
  const hostCar = CARS.find((c) => c.id === carId) || getRandomCar()

  const hostPlayer = {
    id: 'host_' + Math.random().toString(36).substring(2, 9),
    name: hostName || 'Racer 1',
    isHost: true,
    car: hostCar,
    isReady: true,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishTime: null,
    rank: null,
    lastActive: Date.now(),
  }

  const room = {
    id: 'room_' + Math.random().toString(36).substring(2, 9),
    code,
    quote,
    status: 'waiting', // 'waiting' | 'countdown' | 'racing' | 'finished'
    countdownStart: null,
    raceStart: null,
    players: [hostPlayer],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  rooms.set(code, room)
  return { room, hostPlayer }
}

export const getRoom = (code) => {
  if (!code) return null
  const room = rooms.get(code.toUpperCase())
  if (!room) return null

  // Process Bot updates if race is active
  simulateBots(room)
  return room
}

export const joinRoom = (code, { playerName, carId }) => {
  const room = getRoom(code)
  if (!room) return { error: 'Room not found' }
  if (room.status === 'racing') return { error: 'Race is already in progress' }
  if (room.players.length >= 8) return { error: 'Room is full (max 8 racers)' }

  const playerCar = CARS.find((c) => c.id === carId) || getRandomCar()
  const player = {
    id: 'player_' + Math.random().toString(36).substring(2, 9),
    name: playerName || `Racer ${room.players.length + 1}`,
    isHost: false,
    car: playerCar,
    isReady: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
    finishTime: null,
    rank: null,
    lastActive: Date.now(),
  }

  room.players.push(player)
  room.updatedAt = Date.now()
  return { room, player }
}

export const addBotToRoom = (code, botSpeed = 'medium') => {
  const room = getRoom(code)
  if (!room) return null
  if (room.players.length >= 8) return null

  const botNames = ['CyberTurbo Bot', 'GhostDrift Bot', 'ApexShift Bot', 'NitroPulse Bot', 'PixelPilot Bot']
  const botName = botNames[room.players.length % botNames.length]
  const botCar = getRandomCar()

  // Base bot target speed: easy ~45 WPM, medium ~70 WPM, hard ~105 WPM
  const targetWpm = botSpeed === 'easy' ? 45 : botSpeed === 'hard' ? 105 : 72

  const bot = {
    id: 'bot_' + Math.random().toString(36).substring(2, 9),
    name: `${botName} [AI]`,
    isHost: false,
    isBot: true,
    targetWpm,
    car: botCar,
    isReady: true,
    progress: 0,
    wpm: 0,
    accuracy: 98,
    finished: false,
    finishTime: null,
    rank: null,
    lastActive: Date.now(),
  }

  room.players.push(bot)
  room.updatedAt = Date.now()
  return room
}

export const removePlayer = (code, playerId) => {
  const room = getRoom(code)
  if (!room) return null

  room.players = room.players.filter((p) => p.id !== playerId)
  if (room.players.length === 0) {
    rooms.delete(code)
    return null
  }

  // If host left, assign new host
  if (!room.players.some((p) => p.isHost && !p.isBot)) {
    const firstHuman = room.players.find((p) => !p.isBot) || room.players[0]
    if (firstHuman) firstHuman.isHost = true
  }

  room.updatedAt = Date.now()
  return room
}

export const setPlayerReady = (code, playerId, isReady) => {
  const room = getRoom(code)
  if (!room) return null

  const player = room.players.find((p) => p.id === playerId)
  if (player) {
    player.isReady = isReady
    room.updatedAt = Date.now()
  }
  return room
}

export const startRaceCountdown = (code) => {
  const room = getRoom(code)
  if (!room) return null

  room.status = 'countdown'
  room.countdownStart = Date.now()
  // 3.5 seconds countdown then race starts
  room.raceStart = Date.now() + 3500
  room.updatedAt = Date.now()
  return room
}

export const updatePlayerProgress = (code, { playerId, progress, wpm, accuracy, finished }) => {
  const room = getRoom(code)
  if (!room) return null

  const player = room.players.find((p) => p.id === playerId)
  if (!player) return null

  player.progress = Math.min(100, Math.max(0, progress))
  player.wpm = Math.max(0, Math.round(wpm))
  player.accuracy = Math.min(100, Math.max(0, Math.round(accuracy)))
  player.lastActive = Date.now()

  if (finished && !player.finished) {
    player.finished = true
    player.finishTime = room.raceStart ? (Date.now() - room.raceStart) / 1000 : 0

    // Assign rank
    const finishedCount = room.players.filter((p) => p.finished).length
    player.rank = finishedCount

    // If all players are finished, mark race finished
    if (room.players.every((p) => p.finished)) {
      room.status = 'finished'
    }
  }

  room.updatedAt = Date.now()
  return room
}

export const rematchRoom = (code) => {
  const room = getRoom(code)
  if (!room) return null

  room.quote = getRandomQuote()
  room.status = 'waiting'
  room.countdownStart = null
  room.raceStart = null
  room.updatedAt = Date.now()

  // Reset players progress
  room.players.forEach((p) => {
    p.progress = 0
    p.wpm = 0
    p.accuracy = 100
    p.finished = false
    p.finishTime = null
    p.rank = null
    p.isReady = p.isBot ? true : p.isHost
  })

  return room
}

// Bot simulation ticker during active racing
function simulateBots(room) {
  const now = Date.now()

  // Automatically transition from countdown to racing after 3.5s
  if (room.status === 'countdown' && room.raceStart && now >= room.raceStart) {
    room.status = 'racing'
  }

  if (room.status !== 'racing' || !room.raceStart) return

  const elapsedSeconds = (now - room.raceStart) / 1000
  if (elapsedSeconds <= 0) return

  const totalWords = room.quote.text.split(' ').length

  room.players.forEach((player) => {
    if (!player.isBot || player.finished) return

    // Calculate simulated progress based on bot target WPM with minor variance
    const wordsTyped = (player.targetWpm / 60) * elapsedSeconds
    const targetProgress = Math.min(100, (wordsTyped / totalWords) * 100)

    player.progress = Math.round(targetProgress * 10) / 10
    player.wpm = Math.round(player.targetWpm + (Math.sin(elapsedSeconds * 2) * 4))

    if (player.progress >= 100 && !player.finished) {
      player.finished = true
      player.finishTime = elapsedSeconds
      const finishedCount = room.players.filter((p) => p.finished).length
      player.rank = finishedCount
    }
  })

  if (room.players.every((p) => p.finished)) {
    room.status = 'finished'
  }
}
