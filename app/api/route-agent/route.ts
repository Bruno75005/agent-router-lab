
import { NextResponse } from "next/server"

const keywordMap = {
  // feedbackBot
  feedback: "feedbackBot",
  client: "feedbackBot",
  
  // devHelper
  dev: "devHelper",
  code: "devHelper",
  
  // dataScout
  csv: "dataScout",
  données: "dataScout",
  
  // graphMaster
  graph: "graphMaster",
  courbe: "graphMaster",
  visualisation: "graphMaster",
  
  // docReader
  résumé: "docReader",
  document: "docReader",
  pdf: "docReader",
  
  // sqlSensei
  sql: "sqlSensei",
  select: "sqlSensei",
  requête: "sqlSensei",
  base: "sqlSensei",
  
  // trendWatch
  tendance: "trendWatch",
  analyse: "trendWatch",
  pattern: "trendWatch",
  
  // explainBot
  pourquoi: "explainBot",
  comment: "explainBot",
  définition: "explainBot",
  
  // imageAnalyst
  image: "imageAnalyst",
  screenshot: "imageAnalyst",
  diagramme: "imageAnalyst",
  
  // ideaBooster
  idée: "ideaBooster",
  nom: "ideaBooster",
  slogan: "ideaBooster",
  pitch: "ideaBooster",
  
  // legalAdvisor
  rgpd: "legalAdvisor",
  loi: "legalAdvisor",
  contrat: "legalAdvisor",
  cgu: "legalAdvisor",
  
  // emailAssistant
  email: "emailAssistant",
  réponse: "emailAssistant",
  relance: "emailAssistant",
  
  // codeReviewer
  review: "codeReviewer",
  lint: "codeReviewer",
  améliore: "codeReviewer",
  "code qualité": "codeReviewer",
  
  // schedulerBot
  date: "schedulerBot",
  échéance: "schedulerBot",
  planning: "schedulerBot",
  cron: "schedulerBot",
  calendrier: "schedulerBot",
  
  // notionHelper
  plan: "notionHelper",
  table: "notionHelper",
  notion: "notionHelper",
  roadmap: "notionHelper",
  
  // commandGenie
  commande: "commandGenie",
  shell: "commandGenie",
  terminal: "commandGenie",
  docker: "commandGenie",
  bash: "commandGenie",
  
  // bugHunter
  bug: "bugHunter",
  erreur: "bugHunter",
  crash: "bugHunter",
  exception: "bugHunter",
  "stack trace": "bugHunter",
  
  // markdownMaster
  markdown: "markdownMaster",
  readme: "markdownMaster",
  doc: "markdownMaster",
  
  // translationBot
  traduit: "translationBot",
  anglais: "translationBot",
  espagnol: "translationBot",
  traduction: "translationBot"
}

export async function POST(req: Request) {
  const { question } = await req.json()

  const lower = question.toLowerCase()

  // 🎯 Détection par mots-clés
  for (const [keyword, agent] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      return NextResponse.json({
        agent,
        source: "mots-clés"
      })
    }
  }

  // 🤖 Fallback : classification via un petit LLM local (Ollama)
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi4:latest", // ou un autre modèle installé chez toi
      prompt: `Classifie cette requête parmi les agents suivants : feedbackBot, devHelper, dataScout, graphMaster, docReader, sqlSensei, trendWatch, explainBot, imageAnalyst, ideaBooster, legalAdvisor, emailAssistant, codeReviewer, schedulerBot, notionHelper, commandGenie, bugHunter, markdownMaster, translationBot. Requête : "${question}". Répond uniquement par le nom de l'agent.`,
      stream: false
    }),
  })

  const json = await res.json()

  return NextResponse.json({
    agent: json.response.trim(),
    source: "LLM"
  })
}