import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful assistant supporting a LEGO® Serious Play® workshop.
Given the facilitator coach's latest question, generate exactly 2 short, natural-sounding participant responses that someone might realistically say.
Each response should be 1-2 sentences max, written in first person, and directly answer or relate to the coach's question.
Return ONLY a valid JSON array of exactly 2 strings. No explanation, no markdown, no extra text.
Example output: ["The gap represents the mistrust between our two departments.", "I think the missing block is strong leadership at the top."]`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lastCoachMessage: string = body.lastCoachMessage;

    if (!lastCoachMessage) {
      return NextResponse.json({ suggestions: [] }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Coach asked: "${lastCoachMessage}"` },
      ],
      max_tokens: 120,
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content ?? '[]';

    // Safely parse the JSON array from the model's response
    const match = raw.match(/\[.*\]/s);
    const suggestions: string[] = match ? JSON.parse(match[0]) : [];

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error('Suggestions API error:', error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
