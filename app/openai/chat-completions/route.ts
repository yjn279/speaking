import OpenAI from 'openai';

type Message = {
  role:  'user' | 'assistant' | 'system';
  content: string;
};

const openai = new OpenAI();

export async function GET(
  messages: Message[],
  model: string = 'gpt-3.5-turbo',
) {
  const response = await openai.chat.completions.create({
    model: model,
    messages: messages,
  });
 
  return Response.json({
    data: {
      'message': response.choices[0].message,
    }
  })
}
