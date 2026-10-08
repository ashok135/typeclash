import { NextResponse } from 'next/server'
import { startRaceCountdown, getRoom } from '@/lib/roomStore'


export async function POST(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json().catch(() => ({}))
    const { playerId } = body

    const room = getRoom(code)
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    // Verify host if playerId passed
    if (playerId) {
      const player = room.players.find((p) => p.id === playerId)
      if (player && !player.isHost) {
        return NextResponse.json(
          { success: false, error: 'Only the host can start the race' },
          { status: 403, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        )
      }
    }

    const updatedRoom = startRaceCountdown(code)
    return NextResponse.json(
      { success: true, room: updatedRoom },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error('Failed to start race:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
