import { AnyChatMessage } from "~/lib/vovas-openai";

export function parseInputs(messages: AnyChatMessage[]) {

  const inputs = [] as {
    name: string;
    description?: string;
    value: string;
  }[];

  for ( const message of messages ) {
    // Take all {name} or {name|description} placeholders
    const matches = message.content?.matchAll(/\{([^\|\}]+)(?:\|([^\}]+))?\}/g);
    for ( const match of matches ?? [] ) {
      const [placeholder, name, description] = match;
      inputs.push({ 
        name, 
        description: description || undefined,
        value: '' 
      });
    };
  };

  return inputs;

};