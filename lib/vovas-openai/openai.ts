import OpenAI from 'openai';
import { $throw } from 'vovas-utils';

export const openai = (
  apiKey = process.env.OPENAI_API_KEY
    ?? $throw('No OpenAI API key found')
) => new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});
