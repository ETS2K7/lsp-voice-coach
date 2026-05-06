import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Message,
  AgentStatus,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionInstance,
} from '@/types';

export function useVoiceAgent() {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI LSP Coach. Tell me about the LEGO® model you've built today."
    }
  ]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const transcriptRef = useRef<string>('');

  // Stable ref to messages — avoids stale closures without adding to dependency arrays
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Stable ref to processChat — lets the recognition handler call it without re-registering
  const processChatRef = useRef<(text: string) => Promise<void>>(async () => {});

  // Effect 1: Load voices once on mount. Isolated so it never causes a re-render cascade.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Effect 2: Set up SpeechRecognition once on mount.
  // Uses processChatRef so it never needs to re-run when processChat changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus('listening');
      transcriptRef.current = '';
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) transcriptRef.current += finalTranscript;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'aborted') setStatus('idle');
    };

    recognition.onend = async () => {
      const finalContent = transcriptRef.current.trim();
      if (finalContent) {
        setStatus('thinking');
        // Call via ref — always has the latest version, no dependency needed
        await processChatRef.current(finalContent);
      } else {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const speakText = useCallback((text: string) => {
    if (!synthRef.current) return;

    setStatus('speaking');
    synthRef.current.cancel();

    const cleanText = text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice =
      englishVoices.find(v => v.name.includes('Google') || v.name.includes('Premium')) ||
      englishVoices[0];

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setStatus('idle');
    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      setStatus('idle');
    };

    synthRef.current.speak(utterance);
  }, [voices]);

  const processChat = useCallback(async (userText: string) => {
    try {
      const newUserMessage: Message = { id: Date.now().toString(), role: 'user', content: userText };
      const currentMessages = [...messagesRef.current, newUserMessage];
      setMessages(currentMessages);

      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      });

      if (!chatRes.ok) throw new Error('API request failed');

      const chatData = await chatRes.json();
      const aiText: string = chatData.text;

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
      };
      setMessages(prev => [...prev, newAiMessage]);

      // Fetch AI-generated suggestions and start TTS in parallel
      const [newSuggestions] = await Promise.all([
        fetch('/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastCoachMessage: aiText }),
        })
          .then(r => r.json())
          .then(d => d.suggestions as string[])
          .catch(() => [] as string[]),
        Promise.resolve(speakText(aiText)),
      ]);

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error processing chat:', error);
      setStatus('idle');
    }
  }, [speakText]);

  // Keep the ref in sync with the latest processChat
  useEffect(() => { processChatRef.current = processChat; }, [processChat]);

  const handlePushToTalk = useCallback(() => {
    if (status === 'idle') {
      if (synthRef.current?.speaking) synthRef.current.cancel();
      try { recognitionRef.current?.start(); } catch (e) { console.error(e); }
    } else if (status === 'listening') {
      recognitionRef.current?.stop();
    } else if (status === 'speaking') {
      if (synthRef.current?.speaking) synthRef.current.cancel();
      setStatus('idle');
    }
  }, [status]);

  return { status, messages, suggestions, handlePushToTalk, processChat };
}
