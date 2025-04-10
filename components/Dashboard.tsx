'use client'

import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import Link from "next/link"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import { 
  ArrowLeft, 
  BarChart3,
  MessageSquare,
  Code,
  Database,
  LineChart,
  FileText,
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
  TrendingUp
} from 'lucide-react'

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

interface Entry {
  question: string
  agent: string
  method: "mots-clés" | "LLM"
  date: string
  topic?: string
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("agent_history")
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  const getAgentIcon = (agentId: string) => {
    const size = 16
    
    switch(agentId) {
      case "feedbackBot": return <MessageSquare size={size} />;
      case "devHelper": return <Code size={size} />;
      case "dataScout": return <Database size={size} />;
      case "graphMaster": return <LineChart size={size} />;
      case "docReader": return <FileText size={size} />;
      case "sqlSensei": return <Database size={size} />; // Réutilisation de Database pour SQL
      case "trendWatch": return <TrendingUp size={size} />;
      case "explainBot": return <HelpCircle size={size} />;
      case "imageAnalyst": return <Image size={size} />;
      case "ideaBooster": return <Lightbulb size={size} />;
      case "legalAdvisor": return <Scale size={size} />;
      case "emailAssistant": return <Mail size={size} />;
      case "codeReviewer": return <CheckSquare size={size} />;
      case "schedulerBot": return <Calendar size={size} />;
      case "notionHelper": return <Trello size={size} />;
      case "commandGenie": return <Terminal size={size} />;
      case "bugHunter": return <Bug size={size} />;
      case "markdownMaster": return <FileDown size={size} />;
      case "translationBot": return <Globe size={size} />;
      default: return <HelpCircle size={size} />;
    }
  }

  const getDisplayName = (agentId: string): string => {
    const agentMap: Record<string, string> = {
      "feedbackBot": "Feedback Bot",
      "devHelper": "Dev Helper",
      "dataScout": "Data Scout",
      "graphMaster": "GraphMaster",
      "docReader": "Doc Reader",
      "sqlSensei": "SQL Sensei",
      "trendWatch": "Trend Watcher",
      "explainBot": "ExplainBot",
      "imageAnalyst": "Image Analyst",
      "ideaBooster": "Idea Booster",
      "legalAdvisor": "Legal Advisor",
      "emailAssistant": "Email Assistant",
      "codeReviewer": "Code Reviewer",
      "schedulerBot": "Scheduler Bot",
      "notionHelper": "Notion Helper",
      "commandGenie": "Command Genie",
      "bugHunter": "Bug Hunter",
      "markdownMaster": "Markdown Master",
      "translationBot": "Translation Bot"
    }

    return agentMap[agentId] || agentId
  }

  const detectTopic = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes("graph") || lower.includes("chart") || lower.includes("visualisation")) return "Visualisation"
    if (lower.includes("document") || lower.includes("pdf") || lower.includes("résumé")) return "Documents"
    if (lower.includes("sql") || lower.includes("requête") || lower.includes("base")) return "Base de données"
    if (lower.includes("tendance") || lower.includes("analyse") || lower.includes("pattern")) return "Analyse de tendances"
    if (lower.includes("pourquoi") || lower.includes("comment") || lower.includes("définition")) return "Explications"
    if (lower.includes("image") || lower.includes("screenshot") || lower.includes("diagramme")) return "Images"
    if (lower.includes("idée") || lower.includes("slogan") || lower.includes("pitch")) return "Idées créatives"
    if (lower.includes("rgpd") || lower.includes("loi") || lower.includes("contrat") || lower.includes("cgu")) return "Juridique"
    if (lower.includes("email") || lower.includes("réponse") || lower.includes("relance")) return "Emails"
    if (lower.includes("review") || lower.includes("lint") || lower.includes("améliore") || lower.includes("code qualité")) return "Code review"
    if (lower.includes("date") || lower.includes("échéance") || lower.includes("planning")) return "Planification"
    if (lower.includes("plan") || lower.includes("table") || lower.includes("notion") || lower.includes("roadmap")) return "Organisation"
    if (lower.includes("commande") || lower.includes("shell") || lower.includes("terminal") || lower.includes("docker")) return "Commandes"
    if (lower.includes("bug") || lower.includes("erreur") || lower.includes("crash")) return "Bugs"
    if (lower.includes("markdown") || lower.includes("readme") || lower.includes("doc")) return "Documentation"
    if (lower.includes("traduit") || lower.includes("anglais") || lower.includes("traduction")) return "Traduction"
    if (lower.includes("react") || lower.includes("dev") || lower.includes("code")) return "Développement"
    if (lower.includes("csv") || lower.includes("données") || lower.includes("tableau")) return "Données"
    if (lower.includes("client") || lower.includes("feedback") || lower.includes("expérience")) return "Relation client"
    return "Autre"
  }

  // Obtenez des noms d'agent formatés pour l'affichage dans les graphiques
  const formattedAgentNames = entries.map(e => e.agent).filter((agent, index, self) => 
    self.indexOf(agent) === index
  ).map(getDisplayName);

  const agents = Array.from(new Set(entries.map((e) => e.agent)))
  const methodCountByAgent = {
    motsCles: agents.map((agent) => entries.filter((e) => e.agent === agent && e.method === "mots-clés").length),
    llm: agents.map((agent) => entries.filter((e) => e.agent === agent && e.method === "LLM").length),
  }

  const topicCount: Record<string, number> = {}
  entries.forEach((e) => {
    const topic = detectTopic(e.question)
    topicCount[topic] = (topicCount[topic] || 0) + 1
  })

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Navbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <BarChart3 size={24} /> Tableau de bord des aiguillages
        </h1>
        <Link
          href="/"
          className="text-blue-600 text-sm border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Retour au simulateur
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Nombre d'aiguillages par agent</h2>
          <Bar
            data={{
              labels: agents.map(getDisplayName),
              datasets: [
                {
                  label: "Par mots-clés",
                  data: methodCountByAgent.motsCles,
                  backgroundColor: "#34d399",
                },
                {
                  label: "Par LLM",
                  data: methodCountByAgent.llm,
                  backgroundColor: "#60a5fa",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
              scales: {
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Répartition par sujet</h2>
          <Bar
            data={{
              labels: Object.keys(topicCount),
              datasets: [
                {
                  label: "Requêtes",
                  data: Object.values(topicCount),
                  backgroundColor: "#f59e0b",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Chronologie des 10 dernières requêtes</h2>
          <Line
            data={{
              labels: recentEntries.map((e) => new Date(e.date).toLocaleTimeString()),
              datasets: [
                {
                  label: "Aiguillages",
                  data: recentEntries.map((_, i) => i + 1),
                  borderColor: "#a78bfa",
                  backgroundColor: "#ddd6fe",
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { 
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    title: function(context) {
                      const index = context[0].dataIndex;
                      return `Requête: ${recentEntries[index].question}`;
                    },
                    label: function(context) {
                      const index = context.dataIndex;
                      return `Agent: ${getDisplayName(recentEntries[index].agent)}`;
                    },
                    afterLabel: function(context) {
                      const index = context.dataIndex;
                      return `Méthode: ${recentEntries[index].method}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}