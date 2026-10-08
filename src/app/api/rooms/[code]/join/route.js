import { NextResponse } from 'next/server'
import { joinRoom } from '@/lib/roomStore'


export async function POST(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json().catch(() => ({}))
    const { playerName, carId } = body

    const result = joinRoom(code, { playerName, carId })

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    return NextResponse.json(
      {
        success: true,
        room: result.room,
        player: result.player,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error('Failed to join room:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
