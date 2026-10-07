import { NextResponse } from 'next/server'
import { createRoom } from '@/lib/roomStore'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { hostName, playerName, carId, quoteDifficulty, difficulty } = body

    const { room, hostPlayer } = createRoom({
      hostName: hostName || playerName,
      carId,
      quoteDifficulty: quoteDifficulty || difficulty,
    })

    return NextResponse.json({
      success: true,
      room,
      player: hostPlayer,
    })
  } catch (error) {
    console.error('Failed to create room:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
