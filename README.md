# AI LSP Debrief Coach

An AI-powered voice agent built for **Productive Play** — a Bengaluru-based corporate training company that uses the **LEGO® Serious Play® (LSP)** methodology.

This app acts as an AI co-facilitator during the "Actionable Debrief" phase of an LSP workshop. Participants describe their LEGO model out loud, and the AI coach responds with a probing, metaphorical follow-up question to deepen their thinking.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **STT:** Browser-native Web Speech API (`SpeechRecognition`)
- **TTS:** Browser-native Web Speech API (`SpeechSynthesis`)
- **AI Brain:** Groq API (`llama-3.1-8b-instant`)

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your free Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   Get a free key at [console.groq.com](https://console.groq.com).

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in **Google Chrome**.

## Project Structure

```
src/
├── types/index.ts          # All TypeScript type definitions
├── hooks/useVoiceAgent.ts  # Core voice agent logic (STT, TTS, Groq)
└── app/
    ├── page.tsx            # UI — clean, pure rendering only
    ├── globals.css         # Global styles & animations
    └── api/chat/route.ts   # Groq API backend route
```

## How It Works

1. **You speak** — click the microphone and describe a LEGO model.
2. **STT** — the browser transcribes your speech to text in real time.
3. **Groq** — the Next.js backend sends the transcript to Groq's LLM, prompted to act as a certified LSP facilitator.
4. **TTS** — the AI's response is spoken back to you by the browser.
