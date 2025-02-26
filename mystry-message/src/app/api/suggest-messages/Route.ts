import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';
import { NextResponse } from 'next/server';

//check chatgtpp crte kiya ha so dekhlena bad ma 
interface OpenAIError extends Error {
  status?: number;
  headers?: Record<string, string>;
}

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "How would you engineer an AI message generator📱 to craft hyper-personalized texts✍️ that adapt to mood, culture, and context, and what technical hurdles⚙️ would you face in perfecting its tone?||What’s one powerful message💌 you’ve sent or received that reshaped your approach to digital communication🌐, and how would you embed its impact into an automated messaging tool🔧?||If you could launch a worldwide messaging platform🌍 with one groundbreaking feature—like real-time emotion translation😊😢 or holographic delivery📤—which would you choose, and how would you deploy it to tackle a global challenge like isolation🏠?";

    const messages: CoreMessage[] = [{ role: "user", content: prompt }];

    const result = await streamText({
      model: openai('gpt-4o'),
      maxTokens: 400,
      messages 
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      const { name, message, status, headers } = error as OpenAIError;
      return NextResponse.json(
        {
          name,
          message,
          status: status || 'unknown',
          headers: headers || {}
        },
        { status: status || 500 }
      );
    } else {
      console.error("An unexpected error occurred");
      throw error;
    }
  }
}