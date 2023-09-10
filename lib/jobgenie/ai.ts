import OpenAI from 'openai';


export function ai() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
