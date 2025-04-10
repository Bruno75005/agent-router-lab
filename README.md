# 🤖 Agent Router Lab

**Agent Router Lab** est une application de démonstration pédagogique construite avec **Next.js** qui simule l’aiguillage intelligent des requêtes utilisateur vers des agents IA spécialisés.

---

## 🚀 Fonctionnalités principales

- 🔍 **Aiguillage automatique** des questions vers des agents IA via :
  - **Détection par mots-clés**
  - **Fallback avec LLM local (Ollama + Phi)**
- 🧠 **Historique détaillé** avec méthode d’aiguillage, date, et corrections possibles
- 🧪 **Interface de test dynamique** en React + TailwindCSS
- 📊 **Tableau de bord statistique** avec :
  - Fréquence par agent
  - Méthodes utilisées (mots-clés / LLM)
  - Répartition par sujet
  - Timeline des dernières requêtes
- 🛠️ **Correction manuelle** des aiguillages via menu déroulant
- 📝 **Simulateur éducatif** pour entraîner à la création d'agents spécialisés

---

## 🖼️ Aperçu de l'application

![Aperçu](./preview.png) <!-- tu peux remplacer par une capture réelle -->

---

## 🧩 Technologies utilisées

| Frontend       | Backend        | IA / RAG              |
|----------------|----------------|------------------------|
| Next.js 14     | API Routes     | Ollama + Phi4         |
| React 18       | Node.js        | Mots-clés / Heuristique |
| TailwindCSS    | LocalStorage   |                       |
| Shadcn UI Kit  | Chart.js       |                       |

---

## 📦 Installation locale

```bash
git clone https://github.com/Bruno75005/agent-router-lab.git
cd agent-router-lab
npm install
npm run dev

