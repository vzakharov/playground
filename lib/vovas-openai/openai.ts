import OpenAI from 'openai';
import { $throw } from 'vovas-utils';

export const openai = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
    ?? $throw('No OpenAI API key found'),
  dangerouslyAllowBrowser: true,
});
