export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  readonly [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => Promise<void>) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognitionInstance };
    webkitSpeechRecognition: { new (): SpeechRecognitionInstance };
  }
}
