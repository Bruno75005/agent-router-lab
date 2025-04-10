'use client'
import type { JSX } from 'react'

import { useState, useEffect } from 'react'
import { 
  Send, 
  History, 
  Sparkles, 
  BarChart3,
  MessageSquare, 
  Code, 
  Database, 
  LineChart, 
  ClipboardList,
  FileText, 
  Database as SqlIcon, 
  TrendingUp, 
  HelpCircle, 
  Image, 
  Lightbulb, 
  Scale, 
  Mail, 
  CheckSquare, 
  Calendar, 
  Trello, 
  Terminal, 
  Bug, 
  FileDown, 
  Globe,
  Info  
} from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
const getDisplayName = (agentId: string): string => {
  const map: Record<string, string> = {
    feedbackBot: "Feedback Bot", devHelper: "Dev Helper", dataScout: "Data Scout",
    graphMaster: "GraphMaster", docReader: "Doc Reader", sqlSensei: "SQL Sensei",
    trendWatch: "Trend Watcher", explainBot: "ExplainBot", imageAnalyst: "Image Analyst",
    ideaBooster: "Idea Booster", legalAdvisor: "Legal Advisor", emailAssistant: "Email Assistant",
    codeReviewer: "Code Reviewer", schedulerBot: "Scheduler Bot", notionHelper: "Notion Helper",
    commandGenie: "Command Genie", bugHunter: "Bug Hunter", markdownMaster: "Markdown Master",
    translationBot: "Translation Bot"
  }
  return map[agentId] || agentId
}

const agentDescriptions: Record<string, string> = {
  feedbackBot: "Analyse les retours utilisateurs et feedbacks.",
  devHelper: "Aide au développement (code, debug, dev web).",
  dataScout: "Explore les données structurées comme les CSV.",
  graphMaster: "Crée des visualisations graphiques (charts, courbes).",
  docReader: "Lit et résume les documents (PDF, Word).",
  sqlSensei: "Rédige et optimise des requêtes SQL.",
  trendWatch: "Analyse les tendances et signaux faibles.",
  explainBot: "Explique les concepts complexes.",
  imageAnalyst: "Analyse des images, captures, diagrammes.",
  ideaBooster: "Génère des idées créatives, noms, slogans.",
  legalAdvisor: "Donne des conseils juridiques de base.",
  emailAssistant: "Rédige ou reformule des e-mails.",
  codeReviewer: "Améliore ou relit du code.",
  schedulerBot: "Aide à la planification et organisation.",
  notionHelper: "Gère des contenus de type Notion ou tables.",
  commandGenie: "Rédige des commandes shell/CLI/Docker.",
  bugHunter: "Traque les bugs et erreurs techniques.",
  markdownMaster: "Génère ou améliore du Markdown / Readme.",
  translationBot: "Traduit des textes en plusieurs langues."
}

type HistoryEntry = {
  question: string
  agent: string
  method: 'mots-clés' | 'LLM' | 'correction'
  date: string
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<HistoryEntry | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [correctedAgent, setCorrectedAgent] = useState<string | null>(null)
  const [pendingCorrection, setPendingCorrection] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("agent_history")
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const handleTest = async () => {
    if (!input.trim()) return

    const correctionRes = await fetch("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input })
    })
    const correction = await correctionRes.json()

    if (correction.agent) {
      const entry: HistoryEntry = {
        question: input,
        agent: correction.agent,
        method: "correction",
        date: new Date().toISOString(),
      }
      const newHistory: HistoryEntry[] = [entry, ...history]
      setResult(entry)
      setHistory(newHistory)
      localStorage.setItem("agent_history", JSON.stringify(newHistory))
      setInput("")
      return
    }

    const res = await fetch("/api/route-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    })
    const data = await res.json()
    const entry: HistoryEntry = {
      question: input,
      agent: data.agent || "❌ Aucun agent détecté",
      method: data.source || "LLM",
      date: new Date().toISOString(),
    }
    const newHistory: HistoryEntry[] = [entry, ...history]
    setResult(entry)
    setHistory(newHistory)
    localStorage.setItem("agent_history", JSON.stringify(newHistory))
    setCorrectedAgent(null)
    setPendingCorrection(null)
    setInput("")
  }

  const validateCorrection = async () => {
    if (!pendingCorrection || !result) return

    await fetch("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: result.question, agent: pendingCorrection })
    })

    const updatedHistory: HistoryEntry[] = history.map((entry) =>
      entry === result ? { ...entry, agent: pendingCorrection, method: "correction" } : entry
    )
    setHistory(updatedHistory)
    localStorage.setItem("agent_history", JSON.stringify(updatedHistory))
    setCorrectedAgent(pendingCorrection)
    setPendingCorrection(null)
  }

  const handleCorrectionChange = (value: string) => {
    if (!result) return
    if (value !== result.agent) {
      setPendingCorrection(value)
    } else {
      setPendingCorrection(null)
    }
  }

  const agentOptions = Object.keys(agentDescriptions).map((id) => (
    <option key={id} value={id} title={agentDescriptions[id]}>
      {getDisplayName(id)}
    </option>
  ))

  const getAgentIcon = (agentId: string) => {
    const size = 16
    const icons: Record<string, JSX.Element> = {
      feedbackBot: <MessageSquare size={size} />, devHelper: <Code size={size} />,
      dataScout: <Database size={size} />, graphMaster: <LineChart size={size} />,
      docReader: <FileText size={size} />, sqlSensei: <SqlIcon size={size} />,
      trendWatch: <TrendingUp size={size} />, explainBot: <HelpCircle size={size} />, 
      imageAnalyst: <Image size={size} />, ideaBooster: <Lightbulb size={size} />, 
      legalAdvisor: <Scale size={size} />, emailAssistant: <Mail size={size} />,
      codeReviewer: <CheckSquare size={size} />, schedulerBot: <Calendar size={size} />, 
      notionHelper: <Trello size={size} />, commandGenie: <Terminal size={size} />, 
      bugHunter: <Bug size={size} />, markdownMaster: <FileDown size={size} />, 
      translationBot: <Globe size={size} />
    }
    return icons[agentId] || <HelpCircle size={size} />
  }

  const agentColor = (agent: string) => {
    const map: Record<string, string> = {
      feedbackBot: "text-pink-600", devHelper: "text-green-600", dataScout: "text-indigo-600",
      graphMaster: "text-purple-600", docReader: "text-amber-700", sqlSensei: "text-blue-800",
      trendWatch: "text-green-700", explainBot: "text-cyan-700", imageAnalyst: "text-rose-600",
      ideaBooster: "text-yellow-600", legalAdvisor: "text-slate-700", emailAssistant: "text-blue-600",
      codeReviewer: "text-emerald-700", schedulerBot: "text-orange-600", notionHelper: "text-zinc-700",
      commandGenie: "text-fuchsia-600", bugHunter: "text-red-600", markdownMaster: "text-teal-700",
      translationBot: "text-sky-600"
    }
    return map[agent] || "text-gray-800"
  }

  const methodBadge = (method: string) =>
    method === "LLM"
      ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">LLM</span>
      : method === "correction"
      ? <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Correction</span>
      : <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">Mots-clés</span>

  return (
    <>
      <header className="sticky top-0 bg-white z-10 border-b border-zinc-200 shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2 text-blue-700">
          <Sparkles size={22} /> Simulateur d'aiguillage D'AGENTS IA
        </h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-600 hover:text-white transition"
          >
            <BarChart3 size={16} /> Tableau de bord
          </Link>
          <Link
            href="/corrections"
            className="inline-flex items-center gap-2 text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-600 hover:text-white transition"
          >
            <ClipboardList size={16} /> Voir les corrections
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose une question à router..."
            className="flex-1 border border-zinc-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow transition"
          >
            <Send size={18} /> Tester
          </button>
        </div>

        {result && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 shadow-sm space-y-3">
            <p className="text-sm text-zinc-500">🔍 Décision prise</p>
            <div className="text-lg flex items-center gap-2">
              <span className={`font-bold flex items-center gap-1.5 ${agentColor(correctedAgent || result.agent)}`}>
                {getAgentIcon(correctedAgent || result.agent)} {getDisplayName(correctedAgent || result.agent)}
              </span> via {methodBadge(result.method)}
            </div>
            <div className="text-sm text-zinc-600">Corriger manuellement si besoin :</div>
            <div className="flex items-center gap-2">
              <select
                value={pendingCorrection || correctedAgent || result.agent}
                onChange={(e) => handleCorrectionChange(e.target.value)}
                className="border border-zinc-300 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                {agentOptions}
              </select>
              {pendingCorrection && pendingCorrection !== result.agent && (
                <button
                  onClick={validateCorrection}
                  className="px-3 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                >
                  ✅ Valider la correction
                </button>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History size={20} /> Historique des aiguillages
            </h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow-sm">
              <table className="w-full text-sm bg-white">
                <thead className="bg-zinc-100 text-zinc-600 text-left">
                  <tr>
                    <th className="px-4 py-3 border-b">Requête</th>
                    <th className="px-4 py-3 border-b">Agent</th>
                    <th className="px-4 py-3 border-b">Méthode</th>
                    <th className="px-4 py-3 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50 transition">
                      <td className="px-4 py-2 border-b">{entry.question}</td>
                      <td className={`px-4 py-2 border-b font-semibold ${agentColor(entry.agent)}`}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-pointer">
                              {getAgentIcon(entry.agent)} {getDisplayName(entry.agent)}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="text-sm max-w-xs bg-white border rounded shadow px-4 py-2">
                            <div className="font-semibold mb-1 flex items-center gap-2">
                              <Info size={14} /> Rôle de l'agent
                            </div>
                            <p className="text-white font-semibold mb-1 flex items-center gap-2 px-3 py-2 bg-blue-100 border-b border-blue-200 rounded-lg dark:border-bg-blue-600 dark:bg-blue-600">{agentDescriptions[entry.agent]}</p>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="px-4 py-2 border-b">{methodBadge(entry.method)}</td>
                      <td className="px-4 py-2 border-b text-xs text-zinc-500">
                        {new Date(entry.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  )
}