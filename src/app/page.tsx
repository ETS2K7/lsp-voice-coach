'use client';

import { useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

const INITIAL_PROMPTS = [
  {
    label: "Disconnected Islands",
    text: "I built two disconnected islands. One has the workers, one has the treasure, and there's no bridge between them.",
  },
  {
    label: "Shaky Tower",
    text: "My model is a tall tower but the bottom blocks are missing and it feels like it could fall at any moment.",
  },
];

export default function Home() {
  const { status, messages, suggestions, handlePushToTalk, processChat } = useVoiceAgent();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center p-4 sm:p-8 selection:bg-indigo-900/50">

      {/* Header */}
      <header className="w-full max-w-2xl py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-base shadow-lg shadow-indigo-900/30">
            P
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight text-zinc-100">Productive Play</p>
            <p className="text-xs text-zinc-500 leading-tight">LEGO® Serious Play® Coach</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-400">AI Voice Agent</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl flex flex-col flex-grow pb-56">

        {/* Empty state */}
        {messages.length === 1 && (
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-3 py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center mb-2">
              <Mic className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-xl font-semibold text-zinc-200">AI LSP Debrief Coach</h1>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Describe a LEGO® model you&apos;ve built and your AI coach will ask you probing questions to deepen your thinking.
            </p>
          </div>
        )}

        {/* Transcript — shown after first user message */}
        {messages.length > 1 && (
          <div className="flex flex-col gap-5 overflow-y-auto scrollbar-hide py-4">
            {messages.slice(1).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[82%] gap-1 ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold px-1">
                  {msg.role === 'user' ? 'You' : 'Coach'}
                </span>
                <div
                  className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-zinc-100 rounded-tr-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Thinking bubble */}
            {status === 'thinking' && (
              <div className="self-start flex flex-col max-w-[82%] gap-1">
                <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold px-1">Coach</span>
                <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 rounded-tl-sm flex items-center gap-2 text-zinc-500 text-sm">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing your model...
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>
        )}

        {/* First message (welcome) displayed as centered card when no conversation yet */}
        {messages.length === 1 && status === 'speaking' && (
          <div className="flex-grow flex flex-col items-start gap-1 pt-4">
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold px-1">Coach</span>
            <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 rounded-tl-sm text-zinc-300 text-sm leading-relaxed max-w-[82%]">
              {messages[0].content}
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Interaction Panel */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div className="w-full max-w-2xl px-4 pb-10 pt-16 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent flex flex-col items-center gap-4 pointer-events-auto">

          {/* Contextual Suggestion Chips */}
          {status === 'idle' && (
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {(suggestions.length > 0 ? suggestions : INITIAL_PROMPTS.map(p => p.text)).map((text, i) => (
                <button
                  key={i}
                  onClick={() => processChat(text)}
                  title={text}
                  className="text-xs bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 text-zinc-300 px-3.5 py-2 rounded-full transition-all duration-200 max-w-[240px] truncate backdrop-blur-sm"
                >
                  {suggestions.length > 0 ? text : INITIAL_PROMPTS[i]?.label ?? text}
                </button>
              ))}
            </div>
          )}

          {/* Status label */}
          <div className="h-5 flex items-center justify-center">
            {status === 'idle' && (
              <p className="text-xs text-zinc-600">
                {suggestions.length > 0 ? 'Choose a reply or use the microphone' : 'Use the microphone or choose a prompt below'}
              </p>
            )}
            {status === 'listening' && <p className="text-xs text-red-400 font-medium animate-pulse">Listening — click to stop</p>}
            {status === 'thinking' && <p className="text-xs text-indigo-400 font-medium animate-pulse">Thinking...</p>}
            {status === 'speaking' && <p className="text-xs text-emerald-400 font-medium animate-pulse">Speaking — click to interrupt</p>}
          </div>

          {/* Mic Button */}
          <button
            onClick={handlePushToTalk}
            disabled={status === 'thinking'}
            aria-label={status === 'idle' ? 'Start speaking' : status === 'listening' ? 'Stop recording' : 'Interrupt'}
            className={`
              relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              ${status === 'idle' ? 'bg-white hover:bg-zinc-100 text-zinc-900 hover:scale-105' : ''}
              ${status === 'listening' ? 'bg-red-500 text-white scale-110 listening-pulse' : ''}
              ${status === 'thinking' ? 'bg-indigo-500 text-white opacity-50 cursor-not-allowed thinking-pulse' : ''}
              ${status === 'speaking' ? 'bg-emerald-500 text-white hover:bg-emerald-400 speaking-pulse' : ''}
            `}
          >
            {status === 'idle' && <Mic className="w-6 h-6" />}
            {status === 'listening' && <Square className="w-5 h-5 fill-current" />}
            {status === 'thinking' && <Loader2 className="w-6 h-6 animate-spin" />}
            {status === 'speaking' && <Square className="w-5 h-5 fill-current" />}
          </button>

        </div>
      </div>

    </div>
  );
}
