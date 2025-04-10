import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// PATCH/POST /api/corrections/update
export async function POST(req: NextRequest) {
  const { id, agent } = await req.json()

  if (!id || !agent) {
    return NextResponse.json({ error: "Missing id or agent" }, { status: 400 })
  }

  const db = await open({
    filename: './corrections.db',
    driver: sqlite3.Database
  })

  await db.run('UPDATE corrections SET agent = ? WHERE id = ?', agent, id)

  return NextResponse.json({ success: true })
}
