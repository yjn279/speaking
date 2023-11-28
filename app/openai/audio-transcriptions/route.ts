import fs from "fs";
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const { path, model = 'whisper-1' }: {
    path: string,
    model?: string,
  } = await request.json();

  const file = await fs.promises.readFile(path);
  const response = await openai.audio.transcriptions.create({
    model: model, 
    file: file as any,
  });

  return Response.json({
    data: {
      'text': response.text,
    }
  })
}
