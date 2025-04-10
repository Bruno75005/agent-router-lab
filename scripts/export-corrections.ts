import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { join } from 'path'
import fs from 'fs'

async function exportCorrections() {
  const db = await open({
    filename: join(__dirname, '../data/corrections.db'),
    driver: sqlite3.Database
  })

  const rows = await db.all(`SELECT * FROM corrections ORDER BY created_at DESC`)
  const json = JSON.stringify(rows, null, 2)

  const outputPath = join(__dirname, '../export/corrections.json')
  fs.mkdirSync(join(__dirname, '../export'), { recursive: true })
  fs.writeFileSync(outputPath, json)

  console.log(`✅ Corrections exportées dans : ${outputPath}`)
}

exportCorrections()
