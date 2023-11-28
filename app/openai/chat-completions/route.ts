// import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai';

type Message = {
  role:  'user' | 'assistant' | 'system';
  content: string;
};

const openai = new OpenAI();

export async function POST(request: Request) {
  const { messages, model = 'gpt-3.5-turbo'}: {
    messages: Message[],
    model?: string,
  } =  await request.json();

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
