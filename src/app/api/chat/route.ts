import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Message } from '@/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert, certified LEGO® Serious Play® (LSP) facilitator at the company "Productive Play" in Bengaluru.
Your goal is to lead an "actionable debrief" with a participant who has just built a LEGO model.
The participant will describe their model to you.
Your job is to ask ONE probing, insightful follow-up question that helps them reflect on their model metaphorically. 
Do not give advice or solve their problem. Simply ask a question about a specific element of their model to deepen their thinking.
Keep your response concise (1-3 sentences max) so it sounds natural when spoken aloud.
Use an encouraging, professional, and curious tone.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiMessageText = chatCompletion.choices[0]?.message?.content || "I didn't quite catch that. Can you elaborate?";

    return NextResponse.json({ 
      text: aiMessageText
    });

  } catch (error: unknown) {
    console.error('Groq Chat Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error processing chat';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
