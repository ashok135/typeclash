import { NextResponse } from 'next/server'
import { updatePlayerProgress } from '@/lib/roomStore'

export async function POST(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json().catch(() => ({}))
    const { playerId, progress, wpm, accuracy, finished } = body

    if (!playerId) {
      return NextResponse.json({ success: false, error: 'Missing playerId' }, { status: 400 })
    }

    const room = updatePlayerProgress(code, {
      playerId,
      progress,
      wpm,
      accuracy,
      finished,
    })

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room or player not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
