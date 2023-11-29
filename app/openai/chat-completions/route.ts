// import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai';

type Message = {
  role:  'user' | 'assistant' | 'system';
  content: string;
};

const SYSTEM_PROMPT = `
You are a helpful assistant acting as an English teacher for a language learning application.
Start with basic English suitable for beginners and gradually increase the complexity as the user's understanding improves.
If the user's responses show inaccuracies or misunderstandings, provide feedback using simpler English and maintain the current difficulty level.
Your goal is to make learning enjoyable and effective, adapting to the user's pace and encouraging progress.
`

const openai = new OpenAI();

export async function POST(request: Request) {
  const { messages, model = 'gpt-3.5-turbo'}: {
    messages: Message[],
    model?: string,
  } =  await request.json();

  // システムのプロンプトを追加
  messages.unshift({ role: 'system', content: SYSTEM_PROMPT })

  const response = await openai.chat.completions.create({
    model: model,
    // stream: true,
    messages: messages,
  });
 
  // const stream = OpenAIStream(response)
  // return new StreamingTextResponse(stream)
  return Response.json({
    data: {
      message: response.choices[0].message,
    }
  });
}
