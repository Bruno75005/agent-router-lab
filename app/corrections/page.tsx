'use client'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import {
  Sparkles, MessageSquare, Code, Database, LineChart, FileText,
  Database as SqlIcon, TrendingUp, HelpCircle, Image, Lightbulb,
  Scale, Mail, CheckSquare, Calendar, Trello, Terminal, Bug,
  FileDown, Globe, Download, Pencil, Check
} from 'lucide-react'
import Link from 'next/link'

interface CorrectionEntry {
  id: number
  question: string
  agent: string
  date: string
}

const agentIcons: Record<string, JSX.Element> = {
  feedbackBot: <MessageSquare size={16} />, devHelper: <Code size={16} />, dataScout: <Database size={16} />,
  graphMaster: <LineChart size={16} />, docReader: <FileText size={16} />, sqlSensei: <SqlIcon size={16} />,
  trendWatch: <TrendingUp size={16} />, explainBot: <HelpCircle size={16} />, imageAnalyst: <Image size={16} />,
  ideaBooster: <Lightbulb size={16} />, legalAdvisor: <Scale size={16} />, emailAssistant: <Mail size={16} />,
  codeReviewer: <CheckSquare size={16} />, schedulerBot: <Calendar size={16} />, notionHelper: <Trello size={16} />,
  commandGenie: <Terminal size={16} />, bugHunter: <Bug size={16} />, markdownMaster: <FileDown size={16} />,
  translationBot: <Globe size={16} />
}

export default function CorrectionsPage() {
  const [corrections, setCorrections] = useState<CorrectionEntry[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "agent">("date")
  const [editId, setEditId] = useState<number | null>(null)
  const [editAgent, setEditAgent] = useState<string>("")

  useEffect(() => {
    fetch("/api/export/corrections")
      .then((res) => res.json())
      .then((data) => setCorrections(data))
  }, [])

  const filtered = corrections.filter((c) =>
    c.question.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return a.agent.localeCompare(b.agent)
  })

  const handleEdit = (id: number, agent: string) => {
    setEditId(id)
    setEditAgent(agent)
  }

  const handleSave = async (id: number) => {
    await fetch("/api/corrections/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, agent: editAgent })
    })
    const updated = corrections.map(c => c.id === id ? { ...c, agent: editAgent } : c)
    setCorrections(updated)
    setEditId(null)
    setEditAgent("")
  }

  const exportCSV = () => {
    const csv = ["id,question,agent,date"].concat(
      corrections.map(c => `${c.id},"${c.question}",${c.agent},${c.date}`)
    ).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'corrections.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Sparkles size={22} /> Corrections enregistrées
        </h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="text-sm border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white flex items-center gap-1"
          >
            <Download size={16} /> Export CSV
          </button>
          <Link
            href="/"
            className="text-sm border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
          >
            Retour
          </Link>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <input
          type="text"
          placeholder="Recherche dans les questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-zinc-300 px-4 py-2 rounded-md shadow-sm w-full md:w-1/2"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-zinc-300 px-3 py-2 rounded-md shadow-sm"
        >
          <option value="date">Trier par date</option>
          <option value="agent">Trier par agent</option>
        </select>
      </div>

      <table className="w-full text-sm bg-white border border-zinc-200 rounded-md overflow-hidden">
        <thead className="bg-zinc-100">
          <tr>
            <th className="text-left px-4 py-2 border-b">Question</th>
            <th className="text-left px-4 py-2 border-b">Agent</th>
            <th className="text-left px-4 py-2 border-b">Date</th>
            <th className="text-left px-4 py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <tr key={entry.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2 border-b">{entry.question}</td>
              <td className="px-4 py-2 border-b text-blue-700 font-medium flex items-center gap-1.5">
                {agentIcons[entry.agent] || <HelpCircle size={16} />}
                {editId === entry.id ? (
                  <select
                    value={editAgent}
                    onChange={(e) => setEditAgent(e.target.value)}
                    className="ml-2 px-1 py-0.5 border border-zinc-300 rounded"
                  >
                    {Object.keys(agentIcons).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                ) : (
                  <span>{entry.agent}</span>
                )}
              </td>
              <td className="px-4 py-2 border-b text-xs text-zinc-500">
                {new Date(entry.date).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">
                {editId === entry.id ? (
                  <button
                    onClick={() => handleSave(entry.id)}
                    className="text-green-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <Check size={14} /> Valider
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(entry.id, entry.agent)}
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <Pencil size={14} /> Modifier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}