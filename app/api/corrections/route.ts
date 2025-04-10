import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

let db: any = null

async function getDb() {
  if (db) return db
  db = await open({
    filename: path.join(process.cwd(), 'corrections.db'),
    driver: sqlite3.Database
  })
  await db.exec(`CREATE TABLE IF NOT EXISTS corrections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT UNIQUE,
    agent TEXT,
    date TEXT
  )`)
  return db
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = await getDb()

  if (body.question && body.agent) {
    // Enregistrer une correction
    await db.run(
      `INSERT OR REPLACE INTO corrections (question, agent, date)
       VALUES (?, ?, ?)`,
      body.question,
      body.agent,
      new Date().toISOString()
    )
    return NextResponse.json({ status: 'ok' })
  }

  if (body.question) {
    // Chercher une correction existante
    const existing = await db.get(`SELECT agent FROM corrections WHERE question = ?`, body.question)
    if (existing) {
      return NextResponse.json({ agent: existing.agent })
    }
  }

  return NextResponse.json({})
}
