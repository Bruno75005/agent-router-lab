import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'corrections.db')

export async function GET() {
  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database })
    await db.exec(`CREATE TABLE IF NOT EXISTS corrections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT,
      before_agent TEXT,
      after_agent TEXT,
      date TEXT
    )`)

    const rows = await db.all(`SELECT * FROM corrections ORDER BY date DESC`)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
