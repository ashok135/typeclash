// Web Audio API Synthesizer - 100% self-contained, zero external sound files required!

let audioCtx = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// 1. Mechanical Keystroke Clack
export const playKeyClick = (isMuted = false) => {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Randomize pitch slightly for organic typing feel
    const baseFreq = 580 + (Math.random() * 120 - 60)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1800, ctx.currentTime)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.04)
  } catch (e) {}
}

// 2. Mistype Error Thud
export const playKeyError = (isMuted = false) => {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(130, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  } catch (e) {}
}

// 3. Race Countdown Beeps (3, 2, 1 -> GO!)
export const playCountdownBeep = (isGo = false, isMuted = false) => {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const freq = isGo ? 880 : 440 // A5 for GO!, A4 for 3, 2, 1
    const duration = isGo ? 0.35 : 0.15

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    if (isGo) {
      osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + duration)
    }

    gain.gain.setValueAtTime(isGo ? 0.22 : 0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

// 4. Nitro Boost Sound Effect
export const playNitro = (isMuted = false) => {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  } catch (e) {}
}

// 5. Victory Fanfare Arpeggio
export const playVictory = (isMuted = false) => {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const startTime = ctx.currentTime + idx * 0.1

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.18, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
  } catch (e) {}
}

export const initAudioContext = () => {
  getAudioContext()
}

export const playNitroBoost = playNitro
export const playVictoryFanfare = playVictory

