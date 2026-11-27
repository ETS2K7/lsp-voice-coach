# 🧱 AI LSP Debrief Coach

> An AI-powered voice debrief agent built for **Productive Play** — a Bengaluru-based corporate training company specializing in the **LEGO® Serious Play® (LSP)** methodology.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-llama--3.1--8b--instant-f55036?style=flat)](https://groq.com/)

---

## 📖 Overview

In a **LEGO® Serious Play® (LSP)** workshop, participants construct physical three-dimensional models to externalize complex workplace challenges, team dynamics, and strategic ideas. The magic happens during the **Actionable Debrief** phase: participants tell the story behind their model, and a facilitator asks targeted metaphorical questions that help them extract actionable insights.

**AI LSP Debrief Coach** acts as an AI co-facilitator in this debrief phase. Participants speak aloud describing their LEGO build, and the AI coach analyzes the metaphorical components in real-time, responding with probing questions designed to deepen their self-reflection without offering premature solutions.

---

## ✨ Features

- 🎙️ **Voice-First Push-to-Talk Interface**
  - Hands-free, speech-driven debrief using the browser's native Web Speech API (`SpeechRecognition`).
  - Natural voice playback (`SpeechSynthesis`) with automatic voice matching preferring high-clarity English voices.
  - Full interruptibility: easily stop recording or mute active speech with a single click.

- 🧠 **Certified LSP Coaching Intelligence**
  - Powered by **Groq** running `llama-3.1-8b-instant` for ultra-low-latency responses (<500ms).
  - Adheres strictly to core LSP facilitation rules: asks one concise, metaphorical question (1–3 sentences) focused on physical elements of the build, avoiding unsolicited advice.

- 💡 **Dynamic Contextual Suggestion Chips**
  - In parallel with speech synthesis, the agent queries Groq (`/api/suggestions`) to generate two realistic, first-person participant responses.
  - Built-in starter scenario chips (*"Disconnected Islands"*, *"Shaky Tower"*) for instant testing and demonstration without voice input.

- 💬 **Live Visual Transcript & Dynamic Status Indicators**
  - Clean conversational transcript with clear user/coach bubble styling and auto-scrolling.
  - Visual status pulses for each state: **Listening** (red pulse), **Thinking** (indigo loader), and **Speaking** (emerald pulse).

- 🎨 **Sleek, Workshop-Ready Dark UI**
  - Designed with Tailwind CSS v4, Geist typography, subtle ambient radial gradients, and responsive fixed bottom controls.

---

## 🛠️ Architecture & Workflow

```text
               +-------------------------------------------+
               |          Participant (Speaker/Mic)        |
               +-------------------------------------------+
                                |             ^
             Speech (Audio)     |             | Spoken Coaching Question
                                v             | (Web Speech Synthesis)
               +--------------------+         |
               | Web Speech API STT |         |
               +--------------------+         |
                                |             |
                     Transcript |             |
                                v             |
                  +---------------------------+----+
                  |    Next.js Client (React)      |
                  +--------------------------------+
                       /                      \
      POST /api/chat  /                        \ POST /api/suggestions
                     v                          v
       +-----------------------+     +-------------------------+
       |   Groq LLM Engine     |     |    Groq LLM Engine      |
       | (llama-3.1-8b-instant)|     | (llama-3.1-8b-instant)  |
       |  Facilitator Question |     |  2 Participant Replies  |
       +-----------------------+     +-------------------------+
                     \                          /
                      \---> Combined Stream --->
```

1. **Speech-to-Text**: The user speaks into the microphone; the browser's speech recognition engine captures and streams the transcript.
2. **Facilitator Prompt Processing (`POST /api/chat`)**: The full debrief message history is sent to Groq with an LSP facilitator system prompt.
3. **Parallel Output**:
   - **Audio Response**: The AI's probing question is spoken aloud using browser text-to-speech.
   - **Quick-Reply Suggestions (`POST /api/suggestions`)**: The question is simultaneously sent to generate two plausible participant follow-ups rendered as interactive suggestion pills.

---

## 💻 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React Server Components & API Routes |
| **Frontend** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Strict type-safe UI and voice hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS with `@theme` variables |
| **AI Inference** | [Groq SDK](https://console.groq.com/) | Ultra-fast Llama 3.1 8B instant inference |
| **Speech Recognition** | Web Speech API (`SpeechRecognition`) | Zero-dependency client-side transcription |
| **Speech Synthesis** | Web Speech API (`SpeechSynthesis`) | Browser-native audio debrief playback |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible UI icons |

---

## 📁 Project Structure

```
lsp-voice-coach/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts         # Groq LLM endpoint: certified LSP facilitator logic
│   │   │   └── suggestions/
│   │   │       └── route.ts         # Dynamic participant reply suggestion generator
│   │   ├── favicon.ico              # App favicon
│   │   ├── globals.css              # Tailwind v4 styles, pulse animations & ambient lighting
│   │   ├── layout.tsx               # Root layout, Geist font, and metadata
│   │   └── page.tsx                 # Debrief session UI & responsive controls
│   ├── hooks/
│   │   └── useVoiceAgent.ts         # Core orchestration: STT, TTS, state & chat loop
│   └── types/
│       └── index.ts                 # TypeScript definitions for messages, agent states & Web Speech API
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS configuration
├── tsconfig.json                    # TypeScript compiler configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.17 or higher (Node 20+ recommended).
- **Browser**: **Google Chrome** or a Chromium-based browser (Edge, Brave) is required for full `SpeechRecognition` API compatibility.
- **Groq API Key**: A free API key from [Groq Cloud Console](https://console.groq.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ETS2K7/lsp-voice-coach.git
   cd lsp-voice-coach
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) in **Google Chrome** and allow microphone access when prompted.

---

## 📡 API Reference

### 1. `POST /api/chat`
Generates the LSP facilitator's follow-up coaching question.

- **Request Body**:
  ```json
  {
    "messages": [
      { "id": "1", "role": "assistant", "content": "Hello! I'm your AI LSP Coach..." },
      { "id": "2", "role": "user", "content": "I built a bridge that connects two towers, but the middle span is transparent." }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "text": "What does the transparency in that middle span allow people to see—or protect them from seeing?"
  }
  ```

### 2. `POST /api/suggestions`
Generates 2 realistic participant follow-up answers based on the coach's question.

- **Request Body**:
  ```json
  {
    "lastCoachMessage": "What does the transparency in that middle span allow people to see—or protect them from seeing?"
  }
  ```
- **Response**:
  ```json
  {
    "suggestions": [
      "It represents complete visibility between leadership and engineering teams.",
      "It shows that our communication is fragile even though it looks clear."
    ]
  }
  ```

---

## 🧱 The LSP Facilitation Methodology

This coach is specifically designed around the pedagogical framework of LEGO® Serious Play®:

1. **Build First, Talk Second**: The model serves as the boundary object and external anchor for the participant's subconscious thoughts.
2. **Metaphor Over Literalism**: The facilitator does not ask "why did you use red bricks?" Instead, they ask questions that unlock the metaphor: *"What does that red wall keep inside?"*
3. **The Participant Owns the Meaning**: Facilitators never interpret models for the participant or offer solutions. The AI is constrained to asking clarifying, deepening questions that encourage self-discovery.

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server at `localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks across project files |

---

## ⚖️ Legal & Trademarks

- **LEGO®** and **LEGO® Serious Play®** are registered trademarks of the LEGO Group.
- This application is an independent project developed for **Productive Play** and is not affiliated with, authorized, or endorsed by the LEGO Group.
