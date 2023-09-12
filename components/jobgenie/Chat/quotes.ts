import { ChatMessage } from "lib/vovas-openai";
import { ChatController } from "./controller";

const quoteRegex = /\n>(.*?)\n/g;

export function getQuotes(message: ChatMessage) {
  const lines = message.content.split('\n\n');
  const quotes = [];
  let leadIn = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('>')) {
      quotes.push({
        leadIn: leadIn,
        quote: line.substring(1).trim(),
      });
      leadIn = null;
    } else if (line !== '') {
      leadIn = line;
    }
  }

  if (leadIn !== null) {
    quotes.push({
      leadIn: leadIn,
      quote: null,
    });
  }

  return quotes;
}

export function hasQuotes(message: ChatMessage) {
  return quoteRegex.test(message.content);
};