import { NextResponse } from 'next/server'
import { rematchRoom } from '@/lib/roomStore'

export async function POST(request, { params }) {
  try {
    const { code } = await params
    const updatedRoom = rematchRoom(code)

    if (!updatedRoom) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, room: updatedRoom })
  } catch (error) {
    console.error('Failed to rematch:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
