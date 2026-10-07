import { NextResponse } from 'next/server'
import { getRoom, removePlayer, setPlayerReady } from '@/lib/roomStore'

export async function GET(request, { params }) {
  try {
    const { code } = await params
    const room = getRoom(code)

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Failed to get room:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json().catch(() => ({}))
    const { playerId, isReady, action } = body

    if (action === 'leave') {
      const room = removePlayer(code, playerId)
      return NextResponse.json({ success: true, room })
    }

    if (typeof isReady === 'boolean') {
      const room = setPlayerReady(code, playerId, isReady)
      return NextResponse.json({ success: true, room })
    }

    const room = getRoom(code)
    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Failed to update room:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
