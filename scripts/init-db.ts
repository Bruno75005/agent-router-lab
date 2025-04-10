import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { join } from 'path'
import fs from 'fs'

async function setup() {
  const dbPath = join(__dirname, '../data/corrections.db')

  // 🔒 Crée le dossier data/ si absent
  const dataDir = join(__dirname, '../data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS corrections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      agent TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log("✅ Base corrections.db initialisée à :", dbPath)
}

setup()
