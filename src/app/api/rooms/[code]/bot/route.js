import { NextResponse } from 'next/server'
import { addBotToRoom } from '@/lib/roomStore'

export async function POST(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json().catch(() => ({}))
    const { speed } = body

    const room = addBotToRoom(code, speed || 'medium')

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found or full' }, { status: 400 })
    }

    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Failed to add bot:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
