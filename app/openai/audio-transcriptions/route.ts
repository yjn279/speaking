import fs from "fs";
import OpenAI from 'openai';

const openai = new OpenAI();

export async function GET(
  path: string,
  model: string = "whisper-1",
) {
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
