# BOLA Marathi — Learn Conversational Marathi with AI

BOLA Marathi is a premium offline-first language learning application designed to help people live, explore, and communicate confidently in Marathi. The application focuses on experiential, branching RPG gameplay rather than rote memorization.

---

## 🚀 Key Features

1. **Story Mode & Conversation Simulator**: Branching dialogue trees with local NPC characters (like Pune rickshaw drivers).
2. **Real-Life Missions**: Practical tasks like negotiating fares, ordering Puneri Misal Pav, or asking directions.
3. **Smart Revision System**: Weak words and pronunciation mistakes are scheduled for spaced-repetition testing using the offline **SM-2 algorithm**.
4. **Detective Mode**: Minigames including "Find the Impostor" (grammar spotter) and "Arrange Words" (word order builder).
5. **Offline Dictionary & Culture Logs**: Over 300+ indexed phrases, audio speakers, and historical logs unlocked using XP.
6. **AI doubtful support**: Built-in grammar corrections and doubt resolutions via serverless Gemini proxies.

---

## 🎨 Visual System

* **Headings Font**: Poppins / Baloo 2
* **Body Font**: Noto Sans Marathi
* **Numbers Font**: Inter
* **Color Scheme**: Warm Marigold Saffron (`#ff7b00`), Crimson Accent (`#ff4757`), Royal Indigo Base (`#6c5ce7`).

---

## 📂 Project Folder Structure

```
├── assets/
│   ├── images/
│   ├── icons/
│   ├── audio/
│   └── illustrations/
├── js/
│   ├── app.js               # Entry script & UI state bindings
│   ├── router.js            # Hash navigation router
│   ├── home.js              # Home stats dashboard view
│   ├── journey.js           # RPG map & Dialog Simulator view
│   ├── practice.js          # Exercises, SM-2 Flashcards & AI doubts
│   ├── dictionary.js        # Search & Culture Unlock Logs
│   ├── profile.js           # Badges & configurations
│   ├── appState.js          # Core Single Source of Truth
│   ├── progressEngine.js    # XP & level progression business rules
│   ├── gameEngine.js        # Travel map unlock gates
│   ├── revisionEngine.js    # SM-2 math formula calculations
│   ├── dialogueManager.js   # Branching conversation selectors
│   ├── detectiveManager.js  # Minigames cards data
│   ├── revisionManager.js   # Error logs localStorage handlers
│   ├── dictionaryManager.js # Vocabulary index crawler
│   ├── aiManager.js         # API caching & mock fallbacks
│   ├── queryCache.js        # IndexedDB SHA-256 API cache
│   └── audioEngine.js       # TTS speakers and native voice mic inputs
├── data/
│   ├── cities/
│   ├── chapters/
│   ├── conversations/
│   ├── missions/
│   ├── lessons/
│   ├── dictionary/
│   └── culture/
├── api/
│   └── ai.js                # Serverless Gemini Flash function handler
├── content-fetcher.js       # Wiktionary scrape utility
├── index.html               # Main entry view
├── sw.js                    # Service Worker caching assets
├── manifest.json            # PWA manifest
└── README.md
```

---

## 💻 Running Locally

### Option 1: Simple Local Run (Offline-first)
Serve the app shell and local data sets using Python:
```bash
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

### Option 2: Live AI Integration dev environment
Install Vercel command line interface and run:
```bash
npm install -g vercel
vercel dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
