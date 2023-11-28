import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  const { input, model = 'tts-1', voice = 'alloy' }: {
    input: string,
    model?: string,
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
  } = await request.json();

  const response = await openai.audio.speech.create({
    input: input,
    model: model,
    voice: voice,
  });

  const file = path.resolve("./speech.mp3");
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(file, buffer);

  return Response.json({
    data: {
      'path': "./speech.mp3",
    }
  })
}
