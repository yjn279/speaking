import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

export async function GET(
  input: string,
  model: string = 'tts-1',
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy',
) {
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
