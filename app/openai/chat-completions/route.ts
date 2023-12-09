// import { OpenAIStream, StreamingTextResponse } from 'ai'
import { readFileSync } from 'fs';
import OpenAI from 'openai';

import { Message } from '@/types/message';

export async function POST(request: Request) {
  const { messages, model = 'gpt-3.5-turbo'}: {
    messages: Message[],
    model?: string,
  } =  await request.json();

  const buffer = readFileSync('app/prompts/main.md');
const system_prompt = buffer.toString();
console.log(system_prompt);

const openai = new OpenAI();

  // システムのプロンプトを追加
  messages.unshift({ role: 'system', content: system_prompt })

  const response = await openai.chat.completions.create({
    model: model,
    // stream: true,
    messages: messages,
    temperature: 0,
  });
 
  // const stream = OpenAIStream(response)
  // return new StreamingTextResponse(stream)
  return Response.json({
    data: {
      message: response.choices[0].message,
    }
  });
}
